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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = exports.createCategoryService = exports.getAllCategoryService = void 0;
const categoryModel_1 = __importDefault(require("../../model/categoryModel"));
const apiError_1 = require("../../utils/apiError");
const getAllCategoryService = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield categoryModel_1.default.find();
    return { categories };
});
exports.getAllCategoryService = getAllCategoryService;
const createCategoryService = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if category already exists (case-insensitive)
    const categoryExists = yield categoryModel_1.default.findOne({
        categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    });
    if (categoryExists)
        throw new apiError_1.ApiError(400, "Category Already exist");
    // Create new category
    const newCategory = yield categoryModel_1.default.create({ categoryName });
    return { newCategory };
});
exports.createCategoryService = createCategoryService;
const deleteCategoryService = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryModel_1.default.findById(categoryId);
    if (!category)
        throw new apiError_1.ApiError(400, "Category not found");
    yield category.deleteOne();
    return { category };
});
exports.deleteCategoryService = deleteCategoryService;
//# sourceMappingURL=index.js.map