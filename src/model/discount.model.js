import mongoose, { Schema } from "mongoose";

const discountSchema = new Schema({
    planID: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    voucherCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    discountPercentage: {
        type: Number,
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
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Discount = mongoose.model("Discount", discountSchema);