"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NewsModel = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed, // Will store as { year: { month: count } }
        default: {},
    },
    publish: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
    collection: "news",
});
// Fast lookup for published news sorted by newest
NewsModel.index({ publish: 1, createdAt: -1 });
// Fast lookup when filtering by category
NewsModel.index({ category: 1, publish: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)("News", NewsModel);
//# sourceMappingURL=newsModel.js.map