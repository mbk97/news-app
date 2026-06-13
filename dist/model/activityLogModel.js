"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activityLogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            "LOGIN",
            "LOGOUT",
            "CREATE_USER",
            "UPDATE_USER",
            "DELETE_USER",
            "CREATE_NEWS",
            "UPDATE_NEWS",
            "DELETE_NEWS",
            "PUBLISH_NEWS",
            "CHANGE_PASSWORD",
            "RESET_PASSWORD",
            "CREATE_CATEGORY",
            "UPDATE_CATEGORY",
            "DELETE_CATEGORY",
            "CREATE_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
        ],
    },
    details: {
        type: String,
        required: true,
    },
    resourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    resourceType: String,
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    collection: "activity-logs",
});
// Indexes
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
const ActivityLog = (0, mongoose_1.model)("ActivityLog", activityLogSchema);
exports.default = ActivityLog;
//# sourceMappingURL=activityLogModel.js.map