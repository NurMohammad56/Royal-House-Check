import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    notifications: [{
        type: {
            type: String,
            enum: ["visit schedule", "new message", "visit update", "plan"]
        },
        message: {
            type: String,
            trim: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }]
})

export const Notification = mongoose.model("Notification", notificationSchema)