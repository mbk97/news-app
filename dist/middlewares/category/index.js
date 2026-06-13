"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryValidatorMiddleware = void 0;
const category_1 = require("../../validator/category");
const createCategoryValidatorMiddleware = (req, res, next) => {
    const validationError = (0, category_1.createCategoryValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.createCategoryValidatorMiddleware = createCategoryValidatorMiddleware;
//# sourceMappingURL=index.js.map