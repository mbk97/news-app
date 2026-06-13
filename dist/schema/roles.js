"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRoleSchema = joi_1.default.object({
    roleName: joi_1.default.string().required().messages({
        "any.required": "Role is required",
        "string.base": "Role must be a string",
    }),
});
//# sourceMappingURL=roles.js.map