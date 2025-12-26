"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewsSchema = exports.forgotPasswordSchema = exports.passwordSchema = exports.changePasswordSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userRegistrationSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(3).max(50).required().messages({
        "string.empty": "Fullname is required",
        "string.min": "Fullname must be at least 3 characters long",
        "string.max": "Fullname cannot exceed 50 characters",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
    }),
    roleName: joi_1.default.string().required().messages({
        "string.empty": "Role name is required",
        "any.required": "Role name is required",
    }),
});
exports.userLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
    }),
    password: joi_1.default.string().min(8),
});
exports.changePasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
    }),
    currentPassword: joi_1.default.string().min(8).message("Current password is required"),
    newPassword: joi_1.default.string().min(8).message("New password is required"),
});
exports.passwordSchema = joi_1.default.object({
    password: joi_1.default.string().min(8).message("Password is required"),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
    }),
});
exports.createNewsSchema = joi_1.default.object({
    newsTitle: joi_1.default.string().min(10).required().messages({
        "string.empty": "newsTitle is required",
        "string.min": "newsTitle must be at least 50 characters long",
        "string.max": "newsTitle cannot exceed 100 characters",
    }),
    newsBody: joi_1.default.string().required().messages({
        "string.empty": "newsBody is required",
    }),
    createdBy: joi_1.default.string().required().messages({
        "string.empty": "createdBy is required",
    }),
    newsImage: joi_1.default.string().required().messages({
        "string.empty": "newsImage is required",
    }),
    category: joi_1.default.string().required().messages({
        "string.empty": "Category is required",
    }),
    subHeadline: joi_1.default.string().optional().allow("").messages({
        "string.empty": "Subheadline can be empty",
    }),
    headline: joi_1.default.boolean().optional().allow("").messages({
        "string.empty": "headline can be empty",
    }),
    publish: joi_1.default.boolean().required().messages({
        "string.empty": "Published status is required",
    }),
});
//# sourceMappingURL=auth.js.map