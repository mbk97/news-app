import { Schema, model } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
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
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  {
    timestamps: true,
    collection: "admin-users",
  }
);

export default model<IUser>("User", userSchema);
