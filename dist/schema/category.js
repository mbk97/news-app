"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCategorySchema = joi_1.default.object({
    categoryName: joi_1.default.string().required().messages({
        "any.required": "Category is required",
        "string.base": "Category name must be a string",
    }),
});
//# sourceMappingURL=category.js.map