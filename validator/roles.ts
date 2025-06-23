import { validate } from "../schema";
import { createRoleSchema } from "../schema/roles";

export const createRoleValidator = (body) => {
  const error = validate(createRoleSchema, body);
  return error;
};
