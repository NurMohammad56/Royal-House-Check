import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["completed", "cancelled", "confirmed"],
        default: 'confirmed'
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
            enum: ["warning", "red alert"]
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
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    addsOnService: {
        type: Schema.Types.ObjectId,
        ref: 'AddsOnService'
    }

}, { timestamps: true })

export const Visit = mongoose.model("Visit", visitSchema);