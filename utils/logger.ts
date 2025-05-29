import ActivityLog from "../model/activityLogModel";
import { Request } from "express";

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
      userId,
      action,
      details,
      resourceId,
      resourceType,
      ipAddress: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
