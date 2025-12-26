/* eslint-disable @typescript-eslint/no-explicit-any */
import ActivityLog from "../model/activityLogModel";
import { Request } from "express";
import { Types } from "mongoose";

export const logActivity = async (
  userId: string,
  action: string,
  details: string,
  req?: Request,
  resourceId?: string,
  resourceType?: string
) => {
  try {
    await ActivityLog.create({
      userId: new Types.ObjectId(userId), // ✅ fixed
      action,
      details,
      resourceId: resourceId
        ? new Types.ObjectId(resourceId) // ✅ convert if present
        : undefined,
      resourceType,
      ipAddress: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
