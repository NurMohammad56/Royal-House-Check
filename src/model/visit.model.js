import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
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
        enum: ['successful', 'pending', 'cancelled', "confirmed"],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['routine check', "emergency", 'follow up']
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    }

}, { timestamps: true })

export const Visit = mongoose.model("Visit", visitSchema)