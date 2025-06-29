import { validate } from "../schema";
import { createCategorySchema } from "../schema/category";

export const createCategoryValidator = (body) => {
  const error = validate(createCategorySchema, body);
  return error;
};
