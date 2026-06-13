"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordRateLimitter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const resetPasswordRateLimitter = (0, express_rate_limit_1.default)({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 1, // Max 1 requests per IP in 15 mins
    handler: (req, res, next, options) => {
        const retryAfter = Math.ceil(options.windowMs / 1000); // seconds
        res.status(options.statusCode).json({
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        });
    },
});
exports.resetPasswordRateLimitter = resetPasswordRateLimitter;
//# sourceMappingURL=authRateLimiter.js.map