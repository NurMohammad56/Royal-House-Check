import mongoose, { Schema } from "mongoose";

const addsOnServiceSchema = new Schema({
    addOn: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    }
}, { timestamps: true });

export const AddsOnService = mongoose.model("AddsOnService", addsOnServiceSchema);