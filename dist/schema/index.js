"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        return error.details[0].message;
    }
    return null;
};
exports.validate = validate;
//# sourceMappingURL=index.js.map