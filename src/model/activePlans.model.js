import mongoose, { Schema } from "mongoose";

const activePlansSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    activePlans: [{
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan'
        },
        isActive: {
            type: Boolean
        }
    }],

    activeServices: [{
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'AddsOnService'
        },
        isActive: {
            type: Boolean
        }
    }],

}, { timestamps: true });

export const activePlan = mongoose.model("activePlan", activePlansSchema);