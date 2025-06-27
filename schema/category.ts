import Joi from "joi";

export const createCategorySchema = Joi.object({
  roleName: Joi.string().required().messages({
    "any.required": "Category is required",
    "string.base": "Category name must be a string",
  }),
});
