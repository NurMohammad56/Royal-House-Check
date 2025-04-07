import { verifyStripeWebhook, handleStripeEvent } from "../services/stripe.service.js";
import { verifyPaypalWebhook, handlePaypalEvent } from "../services/paypal.service.js";
import {Payment} from "../model/payment.model.js";

export const stripeWebhook = async (req, res, next) => {
    try {
        const sig = req.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // Verify the webhook signature
        const event = verifyStripeWebhook(req.body, sig, endpointSecret);

        // Handle the event
        await handleStripeEvent(event, Payment);

        return res.json({ received: true });
    } catch (error) {
        next(error);
    }
};

export const paypalWebhook = async (req, res, next) => {
    try {
        const payload = req.body;
        const headers = req.headers;
        const webhookSecret = process.env.PAYPAL_WEBHOOK_SECRET;

        // Verify the webhook signature
        verifyPaypalWebhook(payload, headers, webhookSecret);

        // Handle the event
        await handlePaypalEvent(payload.event_type, payload, Payment);

        return res.json({ received: true });
    } catch (error) {
        next(error);
    }
};