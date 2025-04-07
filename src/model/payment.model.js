import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["successful", "failed"],
        default: "successful",
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    subscriptionType: {
        type: String,
        enum: ["monthly", "yearly", "weekly"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Payment = mongoose.model("Payment", paymentSchema);