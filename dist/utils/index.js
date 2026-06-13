"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (id) => {
    return (0, jsonwebtoken_1.sign)({
        id,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=index.js.map