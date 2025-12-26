import { Schema, model } from "mongoose";

interface IActivityLog {
  userId: Schema.Types.ObjectId;
  action: string;
  details: string;
  resourceId?: Schema.Types.ObjectId;
  resourceType?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      required: false,
    },
    resourceType: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "activity-logs",
  }
);

activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });

export default model<IActivityLog>("ActivityLog", activityLogSchema);
