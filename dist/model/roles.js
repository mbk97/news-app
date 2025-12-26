"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoleModel = new mongoose_1.Schema({
    roleName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: "roles",
});
exports.default = (0, mongoose_1.model)("Roles", RoleModel);
//# sourceMappingURL=roles.js.map