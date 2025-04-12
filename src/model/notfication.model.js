import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ["visit schedule", "new message", "visit update", "plan", "subscription", "payment", "visit", "system"]
    },
    message: {
        type: String,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedEntityModel"
      },
      relatedEntityModel: {
        type: String,
        enum: ["Payment", "User", "Plan"]
      },
      metadata: {
        type: Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


export const Notification = mongoose.model("Notification", notificationSchema)