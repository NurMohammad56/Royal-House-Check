import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeService = {
    /**
     * Create a Stripe payment intent
     * @param {number} amount - Payment amount in dollars
     * @param {string} currency - Currency code (e.g., 'usd')
     * @param {object} metadata - Additional payment metadata
     * @returns {Promise<{clientSecret: string, paymentIntentId: string}>}
     */
    createPaymentIntent: async (amount, currency, metadata) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency,
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error("Stripe payment error:", error);
            throw new Error("Payment processing failed");
        }
    },

    /**
     * Verify Stripe webhook signature
     * @param {Buffer} payload - Raw request body
     * @param {string} sig - Stripe signature header
     * @param {string} endpointSecret - Webhook secret
     * @returns {Stripe.Event}
     */
    verifyWebhook: (payload, sig, endpointSecret) => {
        try {
            return stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            console.error("Webhook verification failed:", err);
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }
};