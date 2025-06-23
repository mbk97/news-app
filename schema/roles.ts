import Joi from "joi";

export const createRoleSchema = Joi.object({
  roleName: Joi.string().required().messages({
    "any.required": "Role is required",
    "string.base": "Role must be a string",
  }),
});
