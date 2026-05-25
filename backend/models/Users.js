import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    farmSize: {
      type: String,
      default: "",
    },

    crops: {
      type: String,
      default: "",
    },

    soilType: {
      type: String,
      default: "",
    },

    irrigation: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    livestock: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;