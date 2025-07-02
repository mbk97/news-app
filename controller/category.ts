import { Response, Request } from "express";
import { logActivity } from "../utils/logger";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
} from "../services/category";
import { customErrorHandler } from "../utils/apiError";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const { categories } = await getAllCategoryService();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  try {
    const { newCategory } = await createCategoryService(categoryName);
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
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const { category } = await deleteCategoryService(categoryId);
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
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};
