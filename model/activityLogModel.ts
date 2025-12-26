import { Schema, model, InferSchemaType } from "mongoose";

const activityLogSchema = new Schema(
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
    },
    resourceType: String,
    ipAddress: String,
    userAgent: String,
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

// Indexes
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });

// ✅ Let Mongoose infer the document type
export type ActivityLogDoc = InferSchemaType<typeof activityLogSchema>;

const ActivityLog = model<ActivityLogDoc>("ActivityLog", activityLogSchema);

export default ActivityLog;
