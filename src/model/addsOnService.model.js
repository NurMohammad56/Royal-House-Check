import mongoose, { Schema } from "mongoose";

const addsOnServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pack: {
        type: String,
        required: true,
        enum: ["weekly", "monthly", "daily"]
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export const AddsOnService = mongoose.model("AddsOnService", addsOnServiceSchema);