import { model, Schema } from "mongoose";
import { INews } from "../types";

const NewsModel = new Schema<INews>(
  {
    newsTitle: {
      type: String,
      required: true,
    },
    subHeadline: {
      type: String,
      required: false, // Optional field
      default: "", // Default to empty string if not provided
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
    headline: {
      type: Boolean,
      required: false,
    },
    views: {
      type: Number,
      default: 0, // Initialize views at 0
    },
    viewDates: {
      type: [Date],
      default: [],
    },
    monthlyViews: {
      type: Schema.Types.Mixed, // Will store as { year: { month: count } }
      default: {},
    },
    publish: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "news",
  }
);

export default model<INews>("News", NewsModel);
