import { Response, Request } from "express";
import { logActivity } from "../utils/logger";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
} from "../services/category";
import { getCache, setCache } from "../services/cache";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    // Check if categories are cached
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cachedCategories = await getCache<{ categories: any[] }>(
      "categories:all"
    );
    console.log(cachedCategories, "CACHED CATEGORIES");
    if (cachedCategories) {
      return res.status(200).json({
        success: true,
        data: cachedCategories.categories,
      });
    }

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

    // Try to merge new category into existing cache

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cached = await getCache<{ categories: any[] }>("categories:all");

    console.log(cached, "CACHED CATEGORY");

    if (cached?.categories) {
      const updatedCategories = [newCategory, ...cached.categories];
      await setCache("categories:all", { categories: updatedCategories });
    } else {
      // If no cache exists yet, initialize it
      await setCache("categories:all", { categories: [newCategory] });
    }

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
