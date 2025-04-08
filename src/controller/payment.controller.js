import { Payment } from "../model/payment.model.js";
import { Plan } from "../model/plan.model.js";
import { Discount } from "../model/discount.model.js"; // Assuming you have this model
import { initiatePayment } from "../services/payment.service.js";

export const createPayment = async (req, res, next) => {
    try {
        const { userId, planId, subscriptionType, paymentMethod, discountCode } = req.body;

        // Validate inputs
        if (!userId || !planId || !subscriptionType || !paymentMethod) {
            return res.status(400).json({ status: false, message: "Missing required fields" });
        }

        // Fetch the plan details
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ status: false, message: "Plan not found" });
        }

        // Fetch the discount plan details if a discount code is provided
        let discountAmount = 0;
        if (discountCode) {
            const discountPlan = await Discount.findOne({ planID: discountCode });
            if (!discountPlan || !discountPlan.active) {
                return res.status(400).json({ status: false, message: "Invalid or inactive discount plan" });
            }

            // Check if the discount plan is still valid based on the date range
            const currentDate = new Date();
            if (currentDate < new Date(discountPlan.startDate) || currentDate > new Date(discountPlan.endDate)) {
                return res.status(400).json({ status: false, message: "Discount plan expired" });
            }

            // Apply discount to the plan price
            discountAmount = plan.price * (discountPlan.discountPercentage / 100);
        }

        // Calculate the final amount after applying the discount
        let amount;
        if (subscriptionType === "monthly") {
            amount = plan.monthlyPrice - discountAmount;
        } else if (subscriptionType === "yearly") {
            amount = plan.yearlyPrice - discountAmount;
        } else {
            return res.status(400).json({ status: false, message: "Invalid subscription type" });
        }

        // Ensure the amount is not negative
        amount = Math.max(amount, 0);

        // Initiate payment with the selected method
        const paymentDetails = await initiatePayment(paymentMethod, amount);

        // Calculate subscription start and end dates
        let startDate, endDate;
        if (subscriptionType === "monthly") {
            startDate = new Date();
            endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        } else if (subscriptionType === "yearly") {
            startDate = new Date();
            endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        }

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

// Confirm Payment (as it was already in your code)
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

// Payment History (as it was already in your code)
export const getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const payments = await Payment.find()
            .populate("user", "fullname email")
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

// Deactivate Subscription (as it was already in your code)
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
