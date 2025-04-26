import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true
    },

    pack: {
        type: String,
        required: true,
        enum: ["weekly", "monthly", "daily"]
    },
    addsOnServices: [{
        type: Schema.Types.ObjectId,
        ref: "AddsOnService"
    }],
    description: {
        type: String,
        required: true,
        trim: true
    } 

}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);