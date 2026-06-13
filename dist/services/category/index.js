"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = exports.createCategoryService = exports.getAllCategoryService = void 0;
const categoryModel_1 = __importDefault(require("../../model/categoryModel"));
const apiError_1 = require("../../utils/apiError");
const getAllCategoryService = async () => {
    const categories = await categoryModel_1.default.find();
    return { categories };
};
exports.getAllCategoryService = getAllCategoryService;
const createCategoryService = async (categoryName) => {
    // Check if category already exists (case-insensitive)
    const categoryExists = await categoryModel_1.default.findOne({
        categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    });
    if (categoryExists)
        throw new apiError_1.ApiError(400, "Category Already exist");
    // Create new category
    const newCategory = await categoryModel_1.default.create({ categoryName });
    return { newCategory };
};
exports.createCategoryService = createCategoryService;
const deleteCategoryService = async (categoryId) => {
    const category = await categoryModel_1.default.findById(categoryId);
    if (!category)
        throw new apiError_1.ApiError(400, "Category not found");
    await category.deleteOne();
    return { category };
};
exports.deleteCategoryService = deleteCategoryService;
//# sourceMappingURL=index.js.map