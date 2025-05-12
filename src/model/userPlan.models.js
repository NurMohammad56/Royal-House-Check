import mongoose, { Schema } from "mongoose";

const userPlanSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    addOnServices: [{
        type: Schema.Types.ObjectId,
        ref: "AddsOnService"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const UserPlan = mongoose.model("UserPlan", userPlanSchema);