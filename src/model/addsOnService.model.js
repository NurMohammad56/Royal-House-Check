import mongoose, { Schema } from "mongoose";

const addsOnServiceSchema = new Schema({
    addOn: {
        type: String
    },
    price: {
        type: Number
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    }
}, { timestamps: true });

export const AddsOnService = mongoose.model("AddsOnService", addsOnServiceSchema);