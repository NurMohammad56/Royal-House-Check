import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/config.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (amount, currency = "usd") => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), 
            currency,
        });
        return paymentIntent.client_secret; 
    } catch (error) {
        console.error("Stripe error:", error);
        throw error;
    }
};