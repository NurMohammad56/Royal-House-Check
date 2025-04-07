import { createStripePaymentIntent } from "./stripe.service.js";
import { createPaypalOrder } from "./paypal.service.js";

export const initiatePayment = async (paymentMethod, amount, currency = "usd") => {
    switch (paymentMethod) {
        case "stripe":
            return { clientSecret: await createStripePaymentIntent(amount, currency) };

        case "paypal":
            return { orderId: await createPaypalOrder(amount, currency) };

        default:
            throw new Error("Unsupported payment method");
    }
};