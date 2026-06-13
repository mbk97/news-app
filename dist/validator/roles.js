"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleValidator = void 0;
const schema_1 = require("../schema");
const roles_1 = require("../schema/roles");
const createRoleValidator = (body) => {
    const error = (0, schema_1.validate)(roles_1.createRoleSchema, body);
    return error;
};
exports.createRoleValidator = createRoleValidator;
//# sourceMappingURL=roles.js.map