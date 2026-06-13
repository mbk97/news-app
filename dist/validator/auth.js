"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordValidator = exports.passwordValidator = exports.changePasswordValidator = exports.userLoginValidator = exports.userRegistrationValidator = void 0;
const schema_1 = require("../schema");
const auth_1 = require("../schema/auth");
const userRegistrationValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.userRegistrationSchema, body);
    return error;
};
exports.userRegistrationValidator = userRegistrationValidator;
const userLoginValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.userLoginSchema, body);
    return error;
};
exports.userLoginValidator = userLoginValidator;
const changePasswordValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.changePasswordSchema, body);
    return error;
};
exports.changePasswordValidator = changePasswordValidator;
const passwordValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.passwordSchema, body);
    return error;
};
exports.passwordValidator = passwordValidator;
const forgotPasswordValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.forgotPasswordSchema, body);
    return error;
};
exports.forgotPasswordValidator = forgotPasswordValidator;
//# sourceMappingURL=auth.js.map