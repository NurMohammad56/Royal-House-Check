import cron from "node-cron";
import { Payment } from "../model/payment.model.js";
import { createStripePaymentIntent } from "./stripe.service.js";

export const initiatePayment = async (paymentMethod, amount, currency = "usd") => {
    switch (paymentMethod) {
        case "stripe":
            return { clientSecret: await createStripePaymentIntent(amount, currency) };
        default:
            throw new Error("Unsupported payment method");
    }
};
export const deactivateExpiredSubscriptions = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const today = new Date();
            await Payment.updateMany(
                { endDate: { $lte: today }, isActive: true },
                { isActive: false }
            );
            console.log("Expired subscriptions deactivated successfully.");
        } catch (error) {
            console.error("Error deactivating expired subscriptions:", error);
        }
    });
};