import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({

    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },

    addsOnServices: [{
        type: Schema.Types.ObjectId,
        ref: "AddsOnService"
    }]

}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);