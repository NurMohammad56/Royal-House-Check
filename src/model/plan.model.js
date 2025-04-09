import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    monthlyPrice: {
        type: Number,
        required: true,
        get: price => `$${price.toFixed(2)}`, 
        set: price => parseFloat(price.replace(/[^0-9.]/g, '')) 
    },
    yearlyPrice: {
        type: Number,
        required: true,
        get: price => `$${price.toFixed(2)}`,
        set: price => parseFloat(price.replace(/[^0-9.]/g, ''))
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
    }
}, {
    toJSON: {
        getters: true 
    },
    toObject: {
        getters: true 
    }
});

export const Plan = mongoose.model("Plan", planSchema);