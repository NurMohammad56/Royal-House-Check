import { stripeService } from "../services/stripe.service.js";
import { Payment } from "../model/payment.model.js";
import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { User } from "../model/user.model.js";

export const webhookController = {
    handleStripeWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        try {
            // Verify webhook signature
            const event = stripeService.verifyWebhook(req.body, sig, endpointSecret);

            switch (event.type) {
                case 'payment_intent.succeeded':
                    await handleSuccessfulPayment(event.data.object);
                    break;

                case 'payment_intent.payment_failed':
                    await handleFailedPayment(event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            res.json({ received: true });
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
};

// Helper functions
async function handleSuccessfulPayment(paymentIntent) {
    const payment = await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { 
            status: 'completed',
            paymentDate: new Date() 
        },
        { new: true }
    ).populate('visit').populate('user', 'name email');

    if (!payment) return;

    // Update visit status
    await Visit.findByIdAndUpdate(payment.visit._id, {
        status: 'confirmed'
    });

    // Notify admins
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const formattedDate = payment.visit.date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const adminNotifications = adminUsers.map(admin => ({
        userId: admin._id,
        type: "payment",
        message: `Payment of $${(paymentIntent.amount/100).toFixed(2)} succeeded for visit ${payment.visit.visitCode}`,
        relatedEntity: payment._id,
        relatedEntityModel: "Payment",
        metadata: {
            visitDate: formattedDate,
            clientEmail: payment.user.email,
            visitAddress: payment.visit.address
        }
    }));

    // Notify user
    const userNotification = {
        userId: payment.user._id,
        type: "payment",
        message: `Your payment of $${(paymentIntent.amount/100).toFixed(2)} was successful`,
        relatedEntity: payment._id,
        relatedEntityModel: "Payment"
    };

    await Notification.insertMany([...adminNotifications, userNotification]);
}

async function handleFailedPayment(paymentIntent) {
    await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: 'failed' }
    );
}