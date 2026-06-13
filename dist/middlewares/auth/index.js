"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotpasswordValidatorMiddleware = exports.passwordValidatorMiddleware = exports.changePasswordValidatorMiddleware = exports.loginRouteValidatorMiddleware = exports.registerUserValidatorMiddleware = void 0;
const auth_1 = require("../../validator/auth");
const registerUserValidatorMiddleware = (req, res, next) => {
    const validationError = (0, auth_1.userRegistrationValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.registerUserValidatorMiddleware = registerUserValidatorMiddleware;
const loginRouteValidatorMiddleware = (req, res, next) => {
    const validationError = (0, auth_1.userLoginValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.loginRouteValidatorMiddleware = loginRouteValidatorMiddleware;
const changePasswordValidatorMiddleware = (req, res, next) => {
    const validationError = (0, auth_1.changePasswordValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.changePasswordValidatorMiddleware = changePasswordValidatorMiddleware;
const passwordValidatorMiddleware = (req, res, next) => {
    const validationError = (0, auth_1.passwordValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.passwordValidatorMiddleware = passwordValidatorMiddleware;
const forgotpasswordValidatorMiddleware = (req, res, next) => {
    const validationError = (0, auth_1.forgotPasswordValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.forgotpasswordValidatorMiddleware = forgotpasswordValidatorMiddleware;
//# sourceMappingURL=index.js.map