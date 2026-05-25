import User from "../models/Users.js";

// GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    user.email = req.body.email || user.email;

    user.profileImage = req.body.profileImage || user.profileImage;

    user.phone = req.body.phone || user.phone;

    user.address = req.body.address || user.address;

    user.bio = req.body.bio || user.bio;

    user.farmSize = req.body.farmSize || user.farmSize;

    user.crops = req.body.crops || user.crops;

    user.soilType = req.body.soilType || user.soilType;

    user.irrigation = req.body.irrigation || user.irrigation;

    user.experience = req.body.experience || user.experience;

    user.livestock = req.body.livestock || user.livestock;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,

      name: updatedUser.name,

      email: updatedUser.email,

      profileImage: updatedUser.profileImage,

      phone: updatedUser.phone,

      address: updatedUser.address,

      bio: updatedUser.bio,

      farmSize: updatedUser.farmSize,

      crops: updatedUser.crops,

      soilType: updatedUser.soilType,

      irrigation: updatedUser.irrigation,

      experience: updatedUser.experience,

      livestock: updatedUser.livestock,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
