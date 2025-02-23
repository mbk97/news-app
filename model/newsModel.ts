import { model, Schema } from "mongoose";
import { INews } from "../types";

const NewsModel = new Schema<INews>(
  {
    newsTitle: {
      type: String,
      required: true,
    },
    newsBody: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    newsImage: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Initialize views at 0
    },
    publish: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "news",
  },
);

export default model<INews>("News", NewsModel);
