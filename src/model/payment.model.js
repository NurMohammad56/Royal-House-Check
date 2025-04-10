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
    originalAmount: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    amount: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
    },
    transactionId: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { transactionId: { $type: "string" } }
        },
        default: null
    },
    subscriptionType: {
        type: String,
        enum: ["monthly", "yearly"],
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
    paymentMethod: {
        type: String,
        required: true,
        enum: ["stripe"]
    },
    discount: {
        type: {
            code: String,
            percentage: Number,
            amount: {
                type: Number,
                get: v => v ? parseFloat(v.toFixed(2)) : v
            }
        },
        default: undefined
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    toJSON: {
        virtuals: true,
        getters: true,
        transform: (doc, ret) => {
            ret.formattedAmount = `$${ret.amount.toFixed(2)}`;
            ret.formattedOriginalAmount = `$${ret.originalAmount.toFixed(2)}`;
            if (ret.discount?.amount) {
                ret.discount.amount = parseFloat(ret.discount.amount.toFixed(2));
            }
            return ret;
        }
    }
});

// Save the date
paymentSchema.pre('save', function (next) {
    if (!this.paymentDate) {
        this.paymentDate = new Date();
    }
    next();
});

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ isActive: 1 });
paymentSchema.index({ endDate: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);