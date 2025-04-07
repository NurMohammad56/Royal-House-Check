import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Plan = mongoose.model("Plan", planSchema);