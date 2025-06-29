import { validate } from "../schema";
import { createNewsSchema } from "../schema/auth";

export const createNewsValidator = (body) => {
  const error = validate(createNewsSchema, body);
  return error;
};
