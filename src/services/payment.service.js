// payment.service.js
import cron from "node-cron";
import { Payment } from "../model/payment.model.js";
import { createStripePaymentIntent } from "./stripe.service.js";
import { Discount } from "../model/discount.model.js";
import { Plan } from "../model/plan.model.js";

export const paymentService = {
    initiatePayment: async (paymentMethod, amount, currency = "usd", metadata = {}) => {
        switch (paymentMethod) {
            case "stripe":
                return {
                    clientSecret: await createStripePaymentIntent(amount, currency, metadata),
                    paymentMethod: "stripe"
                };
            default:
                throw new Error("Unsupported payment method");
        }
    },

    completePayment: async (paymentId, paymentResult) => {
        try {
            // Validate payment result
            if (!paymentResult || typeof paymentResult !== 'object') {
                throw new Error('Invalid payment result');
            }

            // Determine status based on payment result
            const success = Boolean(paymentResult.success);
            const transactionId = paymentResult.transactionId || null;

            return await Payment.findByIdAndUpdate(
                paymentId,
                {
                    status: success ? 'completed' : 'failed',
                    transactionId,
                    isActive: success
                },
                { new: true }
            );
        } catch (error) {
            console.error('Payment completion error:', error);
            throw error;
        }
    },

    applyDiscount: async (planId, voucherCode) => {
        if (!voucherCode) return null;

        const discount = await Discount.findOne({
            voucherCode,
            planID: planId,
            isActive: true
        }).lean();

        if (!discount) return null;

        const now = new Date();
        if (now < discount.startDate || now > discount.endDate) return null;

        return {
            voucherCode: discount.voucherCode,
            discountPercentage: discount.discountPercentage,
            valid: true
        };
    },

    deactivateExpiredSubscriptions: () => {
        cron.schedule("0 0 * * *", async () => {
            try {
                const today = new Date();
                const result = await Payment.updateMany(
                    { endDate: { $lte: today }, isActive: true },
                    { isActive: false, status: "expired" }
                );
                console.log(`Deactivated ${result.modifiedCount} expired subscriptions`);
            } catch (error) {
                console.error("Subscription deactivation error:", error);
            }
        });
    }
};