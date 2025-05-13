import mongoose, { Schema } from "mongoose";

const addsOnServiceSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    pack: {
        type: String,
        enum: ["weekly", "monthly", "daily", "patrols", "incidents", "visit"]
    },
    description: {
        type: String,
        trim: true
    },
}, { timestamps: true });

export const AddsOnService = mongoose.model("AddsOnService", addsOnServiceSchema);