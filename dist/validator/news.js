"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewsValidator = void 0;
const schema_1 = require("../schema");
const auth_1 = require("../schema/auth");
const createNewsValidator = (body) => {
    const error = (0, schema_1.validate)(auth_1.createNewsSchema, body);
    return error;
};
exports.createNewsValidator = createNewsValidator;
//# sourceMappingURL=news.js.map