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
      type: String,
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

// Fast lookup for published news sorted by newest
NewsModel.index({ publish: 1, createdAt: -1 });

// Fast lookup when filtering by category
NewsModel.index({ category: 1, publish: 1, createdAt: -1 });

export default model<INews>("News", NewsModel);
