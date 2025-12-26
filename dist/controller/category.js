"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getAllCategory = void 0;
const logger_1 = require("../utils/logger");
const category_1 = require("../services/category");
const apiError_1 = require("../utils/apiError");
const getAllCategory = async (req, res) => {
    try {
        const { categories } = await (0, category_1.getAllCategoryService)();
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllCategory = getAllCategory;
const createCategory = async (req, res) => {
    const { categoryName } = req.body;
    try {
        const { newCategory } = await (0, category_1.createCategoryService)(categoryName);
        await (0, logger_1.logActivity)(req.body.userId || "system", // You might need to add userId to the request
        "CREATE_CATEGORY", `Category "${categoryName}" was created`, req, newCategory._id.toString(), "Category");
        return res.status(201).json({
            success: true,
            message: "Category successfully created.",
            data: newCategory,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.createCategory = createCategory;
const deleteCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const { category } = await (0, category_1.deleteCategoryService)(categoryId);
        await (0, logger_1.logActivity)(req.body.userId || "system", "DELETE_CATEGORY", `Category "${category.categoryName}" was deleted`, req, category._id.toString(), "Category");
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map