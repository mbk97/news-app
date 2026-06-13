"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const activityLogModel_1 = __importDefault(require("../model/activityLogModel"));
const mongoose_1 = require("mongoose");
const logActivity = async (userId, action, details, req, resourceId, resourceType) => {
    try {
        await activityLogModel_1.default.create({
            userId: new mongoose_1.Types.ObjectId(userId), // ✅ fixed
            action,
            details,
            resourceId: resourceId
                ? new mongoose_1.Types.ObjectId(resourceId) // ✅ convert if present
                : undefined,
            resourceType,
            ipAddress: req?.ip,
            userAgent: req?.headers["user-agent"],
        });
    }
    catch (error) {
        console.error("Error logging activity:", error);
    }
};
exports.logActivity = logActivity;
//# sourceMappingURL=logger.js.map