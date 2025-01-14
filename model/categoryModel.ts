import { ICategory } from "./../types/index";
import { model, Schema } from "mongoose";

const CategoryModel = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "category",
  },
);

export default model<ICategory>("Category", CategoryModel);
