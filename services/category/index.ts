import Category from "../../model/categoryModel";
import { ApiError } from "../../utils/apiError";

const getAllCategoryService = async () => {
  const categories = await Category.find();
  return { categories };
};
const createCategoryService = async (categoryName: string) => {
  // Check if category already exists (case-insensitive)
  const categoryExists = await Category.findOne({
    categoryName: { $regex: `^${categoryName}$`, $options: "i" },
  });
  if (categoryExists) throw new ApiError(400, "Category Already exist");

  // Create new category
  const newCategory = await Category.create({ categoryName });

  return { newCategory };
};

const deleteCategoryService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(400, "Category not found");
  await category.remove();
  return { category };
};

export { getAllCategoryService, createCategoryService, deleteCategoryService };
