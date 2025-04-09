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
        min: 0,
        max: 100
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (endDate) {
                return endDate > this.startDate;
            },
            message: "End date must be after start date"
        }
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