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
        enum: ["weekly", "monthly", "daily"]
    },
    description: {
        type: String,
        trim: true
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    }
}, { timestamps: true });

export const AddsOnService = mongoose.model("AddsOnService", addsOnServiceSchema);