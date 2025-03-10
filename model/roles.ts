import { IRoles } from "./../types/index";
import { model, Schema } from "mongoose";

const RoleModel = new Schema<IRoles>(
  {
    roleName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "roles",
  }
);

export default model<IRoles>("Roles", RoleModel);
