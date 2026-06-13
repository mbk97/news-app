"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategoryModel = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: "category",
});
exports.default = (0, mongoose_1.model)("Category", CategoryModel);
//# sourceMappingURL=categoryModel.js.map