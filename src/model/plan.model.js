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
        default: null
    },

    endDate: {
        type: Date,
        default: null
    },

    addsOnServices: [{
        type: Schema.Types.ObjectId,
        ref: "AddsOnService"
    }],

    isDeactivated: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);