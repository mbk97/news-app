"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewsValidatorMiddleware = void 0;
const news_1 = require("../../validator/news");
const createNewsValidatorMiddleware = (req, res, next) => {
    const validationError = (0, news_1.createNewsValidator)(req.body);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }
    next();
};
exports.createNewsValidatorMiddleware = createNewsValidatorMiddleware;
//# sourceMappingURL=index.js.map