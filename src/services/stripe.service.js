import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/config.js";
const stripe = new Stripe(STRIPE_SECRET_KEY);


export const createStripePaymentIntent = async (amount, currency, metadata) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent.client_secret;
    } catch (error) {
        console.error("Stripe payment error:", error);
        throw new Error("Payment processing failed");
    }
};
export const verifyStripeWebhook = (payload, sig, endpointSecret) => {
    try {
        return stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (error) {
        throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
};

export const handleStripeEvent = async (event, PaymentModel) => {
    switch (event.type) {
        case "customer.subscription.deleted":
            // Deactivate the subscription when it ends
            await PaymentModel.findOneAndUpdate(
                { transactionId: event.data.object.id },
                { isActive: false }
            );
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
};