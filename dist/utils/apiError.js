"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const customErrorHandler = (error) => {
    const statusCode = error instanceof ApiError && error.statusCode ? error.statusCode : 500;
    const message = error instanceof Error
        ? error.message
        : "Internal Server Error. Please try again later.";
    return {
        statusCode,
        success: false,
        message,
    };
};
exports.customErrorHandler = customErrorHandler;
//# sourceMappingURL=apiError.js.map