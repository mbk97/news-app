import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    userStatus: {
      type: Boolean,
      default: true,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    collection: "admin-users",
  }
);

// ❌ NO <IUser> HERE
const User = model("User", userSchema);

export default User;
