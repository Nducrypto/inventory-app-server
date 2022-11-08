import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },

    bio: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const UserInventory = mongoose.model("UserInventory", userSchema);

export default UserInventory;
