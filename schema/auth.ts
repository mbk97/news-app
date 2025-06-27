import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Fullname is required",
    "string.min": "Fullname must be at least 3 characters long",
    "string.max": "Fullname cannot exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  roleName: Joi.string().required().messages({
    "string.empty": "Role name is required",
    "any.required": "Role name is required",
  }),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(8),
});

export const changePasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  currentPassword: Joi.string().min(8).message("Current password is required"),
  newPassword: Joi.string().min(8).message("New password is required"),
});
export const passwordSchema = Joi.object({
  password: Joi.string().min(8).message("Password is required"),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
});

export const createNewsSchema = Joi.object({
  newsTitle: Joi.string().min(10).max(100).required().messages({
    "string.empty": "newsTitle is required",
    "string.min": "newsTitle must be at least 50 characters long",
    "string.max": "newsTitle cannot exceed 100 characters",
  }),
  newsBody: Joi.string().required().messages({
    "string.empty": "newsBody is required",
  }),
  createdBy: Joi.string().required().messages({
    "string.empty": "createdBy is required",
  }),
  newsImage: Joi.string().required().messages({
    "string.empty": "newsImage is required",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
  subHeadline: Joi.string().optional().allow("").messages({
    "string.empty": "Subheadline can be empty",
  }),
  publish: Joi.boolean().required().messages({
    "string.empty": "Published status is required",
  }),
});
