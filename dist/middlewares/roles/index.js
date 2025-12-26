"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleValidatorMiddleware = void 0;
const roles_1 = require("../../validator/roles");
const createRoleValidatorMiddleware = (req, res, next) => {
    const validationError = (0, roles_1.createRoleValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.createRoleValidatorMiddleware = createRoleValidatorMiddleware;
//# sourceMappingURL=index.js.map