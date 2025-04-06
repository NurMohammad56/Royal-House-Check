import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({

    visitId: {
        type: String,
        required: true,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
        enum: ['complete', 'pending', 'cancelled', "confirmed"],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['routine check', "Emergency", 'follow up'],
        required: true
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    }

}, { timestamps: true })

export const Visit = mongoose.model("Visit", visitSchema)