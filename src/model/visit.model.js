import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    address: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["completed", "cancelled", "confirmed", "pending"],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['routine check', "emergency", 'follow up']
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
    issues: [{
        place: {
            type: String,
            trim: true
        },
        issue: {
            type: String,
            trim: true
        },
        type: {
            type: String,
        },
        media: [{
            type: {
                type: String,
                enum: ["photo", "video"]
            },
            url: {
                type: String,
                trim: true
            }
        }],
        notes: {
            type: String,
            trim: true
        }
    }],
    isPaid: {
        type: Boolean,
        default: false
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    },
    addsOnService: {
        type: Schema.Types.ObjectId,
        ref: 'AddsOnService'
    }

}, { timestamps: true })

export const Visit = mongoose.model("Visit", visitSchema);