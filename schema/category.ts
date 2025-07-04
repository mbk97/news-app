import Joi from "joi";

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().required().messages({
    "any.required": "Category is required",
    "string.base": "Category name must be a string",
  }),
});
