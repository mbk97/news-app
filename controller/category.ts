import { Response, Request } from "express";
import { logActivity } from "../utils/logger";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
} from "../services/category";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const { categories } = await getAllCategoryService();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Internal Server Error. Please try again later.",
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  try {
    const { newCategory } = await createCategoryService(categoryName);
    // Log category creation
    await logActivity(
      req.body.userId || "system", // You might need to add userId to the request
      "CREATE_CATEGORY",
      `Category "${categoryName}" was created`,
      req,
      newCategory._id.toString(),
      "Category"
    );
    return res.status(201).json({
      success: true,
      message: "Category successfully created.",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error. Please try again later.",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const { category } = await deleteCategoryService(categoryId);
    // Log category deletion
    await logActivity(
      req.body.userId || "system",
      "DELETE_CATEGORY",
      `Category "${category.categoryName}" was deleted`,
      req,
      category._id.toString(),
      "Category"
    );
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to delete category. Please try again later.",
    });
  }
};
