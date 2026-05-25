import express from "express";

import multer from "multer";

import path from "path";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// MULTER STORAGE
const storage = multer.diskStorage({

  destination: (
    req,
    file,
    cb
  ) => {

    cb(
      null,

      "uploads/profile"
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {

    cb(

      null,

      `${Date.now()}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage,
});

router.get(
  "/profile",

  protect,

  getUserProfile
);

router.put(
  "/profile",

  protect,

  updateUserProfile
);

// PROFILE IMAGE UPLOAD
router.post(

  "/upload-profile-image",

  protect,

  upload.single("image"),

  async (req, res) => {

    try {

      res.json({

        image:
          `/uploads/profile/${req.file.filename}`,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;