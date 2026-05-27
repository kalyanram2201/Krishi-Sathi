import os
import json
import traceback
import joblib
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F

from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import transforms


app = Flask(__name__)
CORS(app)


# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CROP_MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "crop_best_model.pth")
DISEASE_META_PATH = os.path.join(BASE_DIR, "model_metadata.json")
crop_model = joblib.load(CROP_MODEL_PATH)
print("✅ Crop recommendation model loaded")

with open(DISEASE_META_PATH) as f:
    meta = json.load(f)

disease_class_names = meta["class_names"]
DISEASE_IMG_SIZE    = tuple(meta["img_size"])
NUM_CLASSES         = meta["num_classes"]
print(f"✅ Metadata loaded — {NUM_CLASSES} classes")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"✅ Using device: {device}")


# ── Custom architecture — exact match to checkpoint key/shape layout ───────────

class ConvBN(nn.Module):
    """Conv2d + BN2d. Stored as self.conv / self.bn to match checkpoint keys."""
    def __init__(self, in_ch, out_ch, k=1, s=1, p=0, g=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, k, s, p, groups=g, bias=False)
        self.bn   = nn.BatchNorm2d(out_ch)
    def forward(self, x):
        return F.silu(self.bn(self.conv(x)))


class SEBlock(nn.Module):
    """
    SE with Conv2d fc1/fc2 (checkpoint stores them as 4-D tensors).
    Keys: se.fc1.{weight,bias}  se.bn.{weight,bias,...}  se.fc2.{weight,bias}
    """
    def __init__(self, mid_ch):
        super().__init__()
        sq = max(1, mid_ch // 12)
        # fc1/fc2 are Conv2d(kernel=1) — that's why checkpoint shape is [sq, mid, 1, 1]
        self.fc1 = nn.Conv2d(mid_ch, sq, 1, bias=True)
        self.bn  = nn.BatchNorm1d(sq)
        self.fc2 = nn.Conv2d(sq, mid_ch, 1, bias=True)

    def forward(self, x):
        b, c, _, _ = x.shape
        s = x.mean([2, 3], keepdim=True)      # [B, mid, 1, 1]
        s = self.fc1(s)                        # [B, sq,  1, 1]
        s = F.silu(self.bn(s.view(b, -1))).view(b, -1, 1, 1)
        s = torch.sigmoid(self.fc2(s))         # [B, mid, 1, 1]
        return x * s


class Block0(nn.Module):
    """
    features.0 — depthwise-only (no expansion).
    Keys: conv_dw.{conv,bn}  conv_pwl.{conv,bn}
    """
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv_dw  = ConvBN(in_ch, in_ch,  3, 1, 1, g=in_ch)
        self.conv_pwl = ConvBN(in_ch, out_ch, 1, 1, 0)

    def forward(self, x):
        return self.conv_pwl(self.conv_dw(x))


class MBConv(nn.Module):
    """
    features.1–15 — expansion → depthwise → optional SE → pointwise.
    Keys: conv_exp.{conv,bn}  conv_dw.{conv,bn}  [se.*]  conv_pwl.{conv,bn}
    """
    def __init__(self, in_ch, mid_ch, out_ch, stride, use_se):
        super().__init__()
        self.conv_exp  = ConvBN(in_ch,  mid_ch, 1, 1, 0)
        self.conv_dw   = ConvBN(mid_ch, mid_ch, 3, stride, 1, g=mid_ch)
        self.use_se    = use_se
        if use_se:
            self.se    = SEBlock(mid_ch)
        self.conv_pwl  = ConvBN(mid_ch, out_ch, 1, 1, 0)
        self.has_skip  = (stride == 1 and in_ch == out_ch)

    def forward(self, x):
        out = self.conv_exp(x)
        out = self.conv_dw(out)
        if self.use_se:
            out = self.se(out)
        out = self.conv_pwl(out)
        if self.has_skip:
            out = out + x
        return out


class Block16(nn.Module):
    """
    features.16 — final pointwise.
    Keys: conv  bn  (flat, not nested inside ConvBN)
    """
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.bn   = nn.BatchNorm2d(out_ch)

    def forward(self, x):
        return F.silu(self.bn(self.conv(x)))


class CustomEfficientNet(nn.Module):
    """
    Exact channel schedule read from checkpoint weight shapes:
      stem  : 3→48
      f0    : 48→24  (dw-only, no expansion)
      f1–f2 : mbconv without SE
      f3–f15: mbconv with SE
      f16   : pointwise 277→1920
      head.fc: 1920→num_classes
    """
    def __init__(self, num_classes):
        super().__init__()

        # stem
        self.stem = nn.Sequential()
        self.stem.add_module("conv", nn.Conv2d(3, 48, 3, 2, 1, bias=False))
        self.stem.add_module("bn",   nn.BatchNorm2d(48))

        # exact (in, mid, out, stride, se) from checkpoint shapes
        cfg = [
            # in   mid   out  stride  se
            (48,   48,   24,  1,     False),   # 0  Block0 (mid==in for dw)
            (24,   144,  41,  2,     False),   # 1
            (41,   246,  58,  1,     False),   # 2
            (58,   348,  75,  2,     True),    # 3
            (75,   450,  92,  1,     True),    # 4
            (92,   552,  108, 1,     True),    # 5
            (108,  648,  125, 2,     True),    # 6
            (125,  750,  142, 1,     True),    # 7
            (142,  852,  159, 1,     True),    # 8
            (159,  954,  176, 1,     True),    # 9
            (176,  1056, 193, 1,     True),    # 10
            (193,  1158, 210, 2,     True),    # 11
            (210,  1260, 226, 1,     True),    # 12
            (226,  1356, 243, 1,     True),    # 13
            (243,  1458, 260, 2,     True),    # 14
            (260,  1560, 277, 1,     True),    # 15
        ]

        self.features = nn.ModuleList()

        # Block 0 — depthwise only
        self.features.append(Block0(cfg[0][0], cfg[0][2]))

        # Blocks 1–15 — MBConv
        for in_ch, mid_ch, out_ch, stride, use_se in cfg[1:]:
            self.features.append(MBConv(in_ch, mid_ch, out_ch, stride, use_se))

        # Block 16 — pointwise
        self.features.append(Block16(277, 1920))

        # Head
        self.head = nn.Sequential()
        self.head.add_module("fc", nn.Linear(1920, num_classes))

    def forward(self, x):
        x = F.silu(self.stem.bn(self.stem.conv(x)))
        for block in self.features:
            x = block(x)
        x = x.mean([2, 3])
        x = self.head.fc(x)
        return x


# ── Load model ────────────────────────────────────────────────────────────────
disease_model = CustomEfficientNet(num_classes=NUM_CLASSES)

try:
    checkpoint = torch.load(DISEASE_MODEL_PATH, map_location=device)
    if isinstance(checkpoint, dict):
        if "model_state_dict" in checkpoint:
            checkpoint = checkpoint["model_state_dict"]
        elif "state_dict" in checkpoint:
            checkpoint = checkpoint["state_dict"]

    missing, unexpected = disease_model.load_state_dict(checkpoint, strict=False)
    print(f"\n📋 Missing keys  : {len(missing)}")
    print(f"📋 Unexpected keys: {len(unexpected)}")

    if len(missing) == 0 and len(unexpected) == 0:
        print("✅ All weights loaded perfectly — 0 missing, 0 unexpected")
    else:
        if missing:   print("⚠️  Missing (first 5):",   missing[:5])
        if unexpected:print("⚠️  Unexpected (first 5):", unexpected[:5])

    disease_model.to(device)
    disease_model.eval()
    print("✅ Disease detection model ready\n")

except Exception as e:
    print(f"\n❌ Error loading disease model: {e}")
    traceback.print_exc()


# ── Image transform ───────────────────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize(DISEASE_IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std =[0.229, 0.224, 0.225])
])


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "Krishi-Sathi ML API Running ✅"


@app.route("/predict", methods=["POST"])
def predict_crop():
    try:
        data   = request.json
        sample = pd.DataFrame([{
            "Soil_Type":       data.get("Soil_Type"),
            "Soil_pH":         float(data.get("Soil_pH", 0)),
            "Moisture_Level":  data.get("Moisture_Level"),
            "Season":          data.get("Season"),
            "Location_Region": data.get("Location_Region"),
            "Previous_Crop":   data.get("Previous_Crop"),
        }])
        pred    = crop_model.predict(sample)[0]
        proba   = crop_model.predict_proba(sample)[0]
        classes = crop_model.classes_
        top3    = sorted(zip(classes, proba), key=lambda x: -x[1])[:3]
        return jsonify({
            "crop": pred,
            "top3": [{"name": c, "confidence": float(p)} for c, p in top3]
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def predict_disease(image_file):
    img        = Image.open(image_file).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs       = disease_model(img_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    predicted_class = disease_class_names[predicted.item()]
    top5_prob, top5_idx = torch.topk(probabilities, 5)

    top5 = []
    print("\n===== TOP 5 PREDICTIONS =====")
    for i in range(5):
        idx  = top5_idx[0][i].item()
        conf = top5_prob[0][i].item()
        name = disease_class_names[idx]
        print(f"  {name} -> {conf:.4f}")
        top5.append({"disease": name, "confidence": float(conf)})

    return {
        "disease":    predicted_class,
        "confidence": float(confidence.item()),
        "top5":       top5,
    }


@app.route("/predict-disease", methods=["POST"])
def disease_prediction():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        result = predict_disease(request.files["image"])
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)