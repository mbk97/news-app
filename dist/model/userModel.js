"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    userStatus: {
        type: Boolean,
        default: true,
        required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
    collection: "admin-users",
});
// ❌ NO <IUser> HERE
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map