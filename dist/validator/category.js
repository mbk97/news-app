"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryValidator = void 0;
const schema_1 = require("../schema");
const category_1 = require("../schema/category");
const createCategoryValidator = (body) => {
    const error = (0, schema_1.validate)(category_1.createCategorySchema, body);
    return error;
};
exports.createCategoryValidator = createCategoryValidator;
//# sourceMappingURL=category.js.map