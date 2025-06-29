import { validate } from "../schema";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  passwordSchema,
  userLoginSchema,
  userRegistrationSchema,
} from "../schema/auth";

export const userRegistrationValidator = (body) => {
  const error = validate(userRegistrationSchema, body);
  return error;
};

export const userLoginValidator = (body) => {
  const error = validate(userLoginSchema, body);
  return error;
};

export const changePasswordValidator = (body) => {
  const error = validate(changePasswordSchema, body);
  return error;
};

export const passwordValidator = (body) => {
  const error = validate(passwordSchema, body);
  return error;
};
export const forgotPasswordValidator = (body) => {
  const error = validate(forgotPasswordSchema, body);
  return error;
};
