"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getAllCategory = void 0;
const logger_1 = require("../utils/logger");
const category_1 = require("../services/category");
const apiError_1 = require("../utils/apiError");
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categories } = yield (0, category_1.getAllCategoryService)();
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
});
exports.getAllCategory = getAllCategory;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = req.body;
    try {
        const { newCategory } = yield (0, category_1.createCategoryService)(categoryName);
        yield (0, logger_1.logActivity)(req.body.userId || "system", // You might need to add userId to the request
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
});
exports.createCategory = createCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        const { category } = yield (0, category_1.deleteCategoryService)(categoryId);
        yield (0, logger_1.logActivity)(req.body.userId || "system", "DELETE_CATEGORY", `Category "${category.categoryName}" was deleted`, req, category._id.toString(), "Category");
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
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map