import { Response, Request } from "express";
import Category from "../model/categoryModel";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories. Please try again later.",
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  // Validate input
  if (!categoryName || typeof categoryName !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category name is required and must be a string.",
    });
  }

  try {
    // Check if category already exists (case-insensitive)
    const categoryExists = await Category.findOne({
      categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    // Create new category
    const newCategory = await Category.create({ categoryName });

    return res.status(201).json({
      success: true,
      message: "Category successfully created.",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category. Please try again later.",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
      return;
    } else {
      await category.remove();
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category. Please try again later.",
    });
  }
};
