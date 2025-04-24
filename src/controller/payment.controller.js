import { Payment } from "../model/payment.model.js";
import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { User } from "../model/user.model.js";
import { stripeService } from "../services/stripe.service.js"

export const createVisitPayment = async (req, res, next) => {
    try {
        const { visitId, paymentMethod = "stripe" } = req.body;
        const userId = req.user?._id;

        // Validate payment method
        if (paymentMethod !== "stripe") {
            return res.status(400).json({
                status: false,
                message: "Unsupported payment method"
            });
        }

        // Get the visit
        const visit = await Visit.findById(visitId);
        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "Visit not found"
            });
        }

        // Verify the visit belongs to the user
        if (visit.client.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "Unauthorized access to this visit"
            });
        }

        // Create payment in database
        const paymentRecord = await Payment.create({
            user: userId,
            visit: visitId,
            amount: visit.amount,
            paymentMethod,
            status: 'pending'
        });

        // Create Stripe payment intent
        const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent(
            visit.amount,
            "usd",
            {
                userId: userId.toString(),
                visitId: visitId.toString(),
                paymentId: paymentRecord._id.toString(),
            }
        );

        // Update payment with Stripe reference
        await Payment.findByIdAndUpdate(paymentRecord._id, {
            transactionId: paymentIntentId
        });

        return res.status(200).json({
            success: true,
            message: "Payment initiated",
            data: {
                paymentId: paymentRecord._id,
                amount: visit.amount,
                currency: "USD",
                clientSecret,
            },
        });
    }

    catch (error) {
        next(error);
    }
};

export const createMonthlyOrWeeklyPayment = async (req, res, next) => {

    const userId = req.user?._id;
    const { planId, amount, paymentMethod = "stripe" } = req.body;

    try {

        // Validate planId
        if (!planId) {
            return res.status(400).json({
                status: false,
                message: "Plan is required"
            });
        }

        // Validate payment method
        if (paymentMethod !== "stripe") {
            return res.status(400).json({
                status: false,
                message: "Unsupported payment method"
            });
        }

        //validate amount
        if (!amount) {
            return res.status(400).json({
                status: false,
                message: "Amount missing!!"
            });
        }

        //create payment
        const paymentRecord = await Payment.create({
            user: userId,
            plan: planId,
            amount,
            paymentMethod
        });

        // Create Stripe payment intent
        const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent(
            amount,
            "usd",
            {
                userId: userId.toString(),
                paymentId: paymentRecord._id.toString(),
            }
        );

        // Update payment with Stripe reference
        await Payment.findByIdAndUpdate(paymentRecord._id, {
            transactionId: paymentIntentId
        });

        return res.status(200).json({
            success: true,
            message: "Payment initiated",
            data: {
                paymentId: paymentRecord._id,
                amount,
                currency: "USD",
                clientSecret
            },
        })
    }

    catch (error) {
        next(error)
    }
}

export const confirmPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const { success } = req.body;

        // Validate success status
        if (typeof success !== 'boolean') {
            return res.status(400).json({
                status: false,
                message: "Success status must be a boolean"
            });
        }

        // Find and update payment
        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            {
                status: success ? 'completed' : 'failed',
                paymentDate: new Date()
            },
            { new: true }
        ).populate('visit').populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({
                status: false,
                message: "Payment not found"
            });
        }

        // Check if visit exists
        if (success && payment.visit) {
            await Visit.findByIdAndUpdate(payment.visit._id, {
                status: 'confirmed',
                isPaid: true
            });

            // Get all admin users
            const adminUsers = await User.find({ role: "admin" }).select("_id");

            // Format the visit date
            const visitDate = payment.visit.date.toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            // Create notifications for admins
            const notifications = adminUsers.map(admin => ({
                userId: admin._id,
                type: "payment",
                message: `New payment of $${payment.amount.toFixed(2)} received for visit ${payment.visit.visitCode} scheduled on ${visitDate}`,
                relatedEntity: payment._id,
                relatedEntityModel: "Payment",
                metadata: {
                    visitId: payment.visit._id,
                    clientName: payment.user.name,
                    clientEmail: payment.user.email,
                    visitAddress: payment.visit.address
                }
            }));

            // Save all notifications
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }

            // Also create a notification for the user
            await Notification.create({
                userId: payment.user._id,
                type: "payment",
                message: `Your payment of $${payment.amount.toFixed(2)} for visit ${payment.visit.visitCode} has been confirmed`,
                relatedEntity: payment._id,
                relatedEntityModel: "Payment"
            });
        }

        return res.status(200).json({
            status: true,
            message: success ? "Payment confirmed" : "Payment failed",
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

export const refundPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Validate payment can be refunded
        if (payment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: "Only completed payments can be refunded"
            });
        }

        // Here you would integrate with Stripe's refund API
        // This is a placeholder for the refund logic
        await Payment.findByIdAndUpdate(paymentId, {
            status: 'refunded',
            refundDate: new Date()
        });

        return res.status(200).json({
            success: true,
            message: "Refund processed successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const getUserPayments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const payments = await Payment.find({ user: userId })
            .populate("visit", "visitCode date status") // Populate visit details
            .populate("plan", "name") // Populate only the name of the plan
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPayments = await Payment.countDocuments({ user: userId });

        return res.status(200).json({
            status: true,
            message: "Payments retrieved",
            data: payments.map(payment => ({
                ...payment.toObject(),
                formattedAmount: `$${payment.amount.toFixed(2)}`
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPayments / limit),
                totalItems: totalPayments
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentDetails = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId)
            .populate("visit") // Populate visit details
            .populate("plan", "name") // Populate only the name of the plan
            .populate("user", "name email"); // Populate user details

        if (!payment) {
            return res.status(404).json({
                status: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Payment details retrieved",
            data: payment
        });
    } catch (error) {
        next(error);
    }
};
export const getPaymentById = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId)

        if (!payment) {
            return res.status(404).json({
                status: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Payment found",
            data: {
                ...payment.toObject(),
                formattedAmount: `$${payment.amount.toFixed(2)}`,
                status: payment.isActive ? "active" : payment.status
            }
        });
    } catch (error) {
        next(error);
    }
};