import Joi from "joi";

export const validate = <T>(schema: Joi.ObjectSchema, data: T) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return error.details[0].message;
  }
  return null;
};

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
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])/, "lowercase")
    .regex(/(?=.*[A-Z])/, "uppercase")
    .regex(/(?=.*[0-9])/, "number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
  role: Joi.string().valid("admin", "user").required().messages({
    "any.only": "Role must be either 'admin' or 'user'",
  }),
});

// Schema for user login validation
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])/, "lowercase")
    .regex(/(?=.*[A-Z])/, "uppercase")
    .regex(/(?=.*[0-9])/, "number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
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
  publish: Joi.boolean().required().messages({
    "string.empty": "Published status is required",
  }),
});
