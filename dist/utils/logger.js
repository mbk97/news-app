"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const activityLogModel_1 = __importDefault(require("../model/activityLogModel"));
const mongoose_1 = require("mongoose");
const logActivity = (userId, action, details, req, resourceId, resourceType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield activityLogModel_1.default.create({
            userId: new mongoose_1.Types.ObjectId(userId), // ✅ fixed
            action,
            details,
            resourceId: resourceId
                ? new mongoose_1.Types.ObjectId(resourceId) // ✅ convert if present
                : undefined,
            resourceType,
            ipAddress: req === null || req === void 0 ? void 0 : req.ip,
            userAgent: req === null || req === void 0 ? void 0 : req.headers["user-agent"],
        });
    }
    catch (error) {
        console.error("Error logging activity:", error);
    }
});
exports.logActivity = logActivity;
//# sourceMappingURL=logger.js.map