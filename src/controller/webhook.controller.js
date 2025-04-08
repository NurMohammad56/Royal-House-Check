import { verifyStripeWebhook, handleStripeEvent } from "../services/stripe.service.js";
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
