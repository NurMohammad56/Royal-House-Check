import { Payment } from "../model/payment.model.js";
import { Plan } from "../model/plan.model.js";
import { initiatePayment } from "../services/payment.service.js";

export const createPayment = async (req, res, next) => {
    try {
        const { userId, planId, subscriptionType, paymentMethod } = req.body;

        // Validate inputs
        if (!userId || !planId || !subscriptionType || !paymentMethod) {
            return res.status(400).json({ status: false, message: "Missing required fields" });
        }

        // Fetch the plan details
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ status: false, message: "Plan not found" });
        }

        // Calculate the amount based on subscription type
        let amount;
        let startDate, endDate;

        if (subscriptionType === "monthly") {
            amount = plan.monthlyPrice;
            startDate = new Date();
            endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        } else if (subscriptionType === "yearly") {
            amount = plan.yearlyPrice;
            startDate = new Date();
            endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        } else {
            return res.status(400).json({ status: false, message: "Invalid subscription type" });
        }

        // Initiate payment with the selected method
        const paymentDetails = await initiatePayment(paymentMethod, amount);

        // Create the payment record in the database
        const payment = await Payment.create({
            user: userId,
            plan: planId,
            amount,
            status: "pending",
            transactionId: paymentDetails.orderId || null,
            subscriptionType,
            startDate,
            endDate,
        });

        return res.status(201).json({
            status: true,
            message: "Payment initiated successfully",
            data: { ...paymentDetails, paymentId: payment._id },
        });
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const { paymentStatus } = req.body;

        // Update payment status in the database
        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            { status: paymentStatus },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ status: false, message: "Payment not found" });
        }

        return res.status(200).json({ status: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// Get Payment History
export const getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const payments = await Payment.find()
            .populate("user", "fullname email")
            .populate("plan", "name amount")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPayments = await Payment.countDocuments();

        return res.status(200).json({
            status: true,
            message: "Payment history retrieved successfully",
            data: payments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPayments / limit),
                totalItems: totalPayments,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateSubscription = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        // Find and update the subscription
        const subscription = await Payment.findByIdAndUpdate(
            paymentId,
            { isActive: false },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ status: false, message: "Subscription not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Subscription deactivated successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};