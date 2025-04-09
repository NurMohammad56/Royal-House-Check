import { Payment } from "../model/payment.model.js";
import { Plan } from "../model/plan.model.js";
import { Discount } from "../model/discount.model.js";
import { paymentService } from "../services/payment.service.js";
import { User } from "../model/user.model.js";
import { Notification } from "../model/notfication.model.js";
import Stripe from "stripe";
import PDFDocument from "pdfkit";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res, next) => {
    try {
        const { planID, subscriptionType, voucherCode, paymentMethod = "stripe" } = req.body;
        const userId = req.user?._id;

        // Validate payment method
        const supportedMethods = ["stripe"];
        if (!supportedMethods.includes(paymentMethod)) {
            return res.status(400).json({
                status: false,
                message: "Unsupported payment method"
            });
        }

        // Validate plan exists
        const plan = await Plan.findById(planID);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        // Get base amount
        const baseAmount = subscriptionType === "monthly"
            ? parseFloat(plan.monthlyPrice.toString().replace(/[^0-9.]/g, ''))
            : parseFloat(plan.yearlyPrice.toString().replace(/[^0-9.]/g, ''));

        if (isNaN(baseAmount)) {
            return res.status(400).json({
                status: false,
                message: "Invalid plan pricing"
            });
        }

        // Apply discount if voucher exists
        let discountInfo = null;
        let finalAmount = baseAmount;

        if (voucherCode) {
            const discount = await Discount.findOne({
                voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') }, // Case insensitive
                planID,
                isActive: true,
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() },
            });

            if (!discount) {
                // Detailed error information for debugging
                const exists = await Discount.exists({ voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') } });
                const activeForPlan = await Discount.exists({
                    voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') },
                    planID
                });
                const activeNow = await Discount.exists({
                    voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') },
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                });

                return res.status(400).json({
                    status: false,
                    message: "Invalid or expired discount voucher",
                    details: {
                        voucherExists: exists,
                        validForPlan: activeForPlan,
                        currentlyActive: activeNow,
                        currentDate: new Date()
                    }
                });
            }

            const discountAmount = baseAmount * (discount.discountPercentage / 100);
            finalAmount = parseFloat((baseAmount - discountAmount).toFixed(2));

            discountInfo = {
                voucherCode: discount.voucherCode,
                discountPercentage: discount.discountPercentage,
                originalAmount: baseAmount,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                finalAmount,
            };
        }

        // Create payment in database first
        const paymentRecord = await Payment.create({
            user: userId,
            plan: planID,
            amount: finalAmount,
            originalAmount: baseAmount,
            subscriptionType,
            paymentMethod,
            status: 'pending',
            isActive: false,
            startDate: new Date(),
            endDate: new Date(),
            ...(discountInfo && {
                discount: {
                    voucherCode: discountInfo.voucherCode,
                    discountPercentage: discountInfo.discountPercentage,
                    amountSaved: discountInfo.discountAmount
                }
            }),
        });

        // Create Stripe payment intent
        const amountInCents = Math.round(finalAmount * 100);
        let paymentIntent;

        if (paymentMethod === "stripe") {
            paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: "usd",
                metadata: {
                    userId: userId?.toString() || "guest",
                    planID,
                    subscriptionType,
                    paymentId: paymentRecord._id.toString(),
                    voucherCode: voucherCode || "none",
                    paymentMethod,
                },
            });

            // Update payment record with Stripe payment ID
            await Payment.findByIdAndUpdate(paymentRecord._id, {
                paymentProviderId: paymentIntent.id
            });
        }

        return res.status(200).json({
            status: true,
            message: "Payment initiated",
            data: {
                paymentId: paymentRecord._id,
                stripePaymentId: paymentIntent?.id,
                amount: finalAmount,
                originalAmount: baseAmount,
                currency: "USD",
                paymentMethod,
                clientSecret: paymentIntent?.client_secret || null,
                discount: discountInfo,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const { success, transactionId } = req.body;

        // Validate success status
        if (typeof success !== 'boolean') {
            return res.status(400).json({
                status: false,
                message: "Success status must be a boolean"
            });
        }

        // Find payment with user and plan details
        const payment = await Payment.findById(paymentId)
            .populate('user', 'fullname email')
            .populate('plan', 'name');

        if (!payment) {
            return res.status(404).json({
                status: false,
                message: "Payment not found"
            });
        }

        // Calculate subscription period
        const startDate = new Date();
        let endDate = new Date();

        if (success) {
            if (payment.subscriptionType === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (payment.subscriptionType === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            // Format dates for notifications
            const formattedEndDate = endDate.toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            // Get all admin users
            const adminUsers = await User.find({ role: "admin" }).select("_id");

            // Create notifications array
            const notifications = [];

            // Notification for purchasing user
            notifications.push({
                userId: payment.user._id,
                type: "subscription",
                message: `Your ${payment.subscriptionType} subscription (${payment.plan.name}) for $${payment.amount} has been activated! Valid until ${formattedEndDate}`,
                relatedEntity: payment._id,
                relatedEntityModel: "Payment"
            });

            // Notifications for all admins
            adminUsers.forEach(admin => {
                notifications.push({
                    userId: admin._id,
                    type: "subscription",
                    message: `New ${payment.subscriptionType} subscription (${payment.plan.name}) purchased by ${payment.user.fullname} (${payment.user.email}) for $${payment.amount}`,
                    relatedEntity: payment._id,
                    relatedEntityModel: "Payment",
                    metadata: {
                        discountApplied: payment.discount ? true : false,
                        originalAmount: payment.originalAmount,
                        finalAmount: payment.amount
                    }
                });
            });

            // Save all notifications
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        }

        // Update payment status
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            {
                status: success ? 'completed' : 'failed',
                transactionId: transactionId || null,
                isActive: success,
                startDate: success ? startDate : undefined,
                endDate: success ? endDate : undefined,
            },
            { new: true }
        );

        return res.status(200).json({
            status: true,
            message: success ? "Payment confirmed" : "Payment failed",
            data: updatedPayment
        });
    } catch (error) {
        next(error);
    }
};

export const getUserPaymentHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Get paginated payment history for user
        const payments = await Payment.find({ user: userId })
            .populate("plan", "name features")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPayments = await Payment.countDocuments({ user: userId });

        return res.status(200).json({
            status: true,
            message: "Payment history retrieved",
            data: payments.map(p => ({
                ...p.toObject(),
                formattedAmount: `$${p.amount.toFixed(2)}`,
                status: p.isActive ? "active" : p.status
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
export const getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Get paginated payment history for user
        const payments = await Payment.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPayments = await Payment.countDocuments();

        return res.status(200).json({
            status: true,
            message: "Payment history retrieved",
            data: payments.map(p => ({
                ...p.toObject(),
                formattedAmount: `$${p.amount.toFixed(2)}`,
                status: p.isActive ? "active" : p.status
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

export const getPaymentById = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).populate("plan", "name features");

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

export const deactivateSubscription = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        // Deactivate subscription
        const subscription = await Payment.findByIdAndUpdate(
            paymentId,
            {
                isActive: false,
                status: "cancelled",
                endDate: new Date()
            },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ status: false, message: "Subscription not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Subscription cancelled",
            data: {
                ...subscription.toObject(),
                endDate: subscription.endDate.toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

export const downloadPaymentPdf = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).populate("plan", "name features");

        if (!payment) {
            return res.status(404).json({ status: false, message: "Payment not found" });
        }

        const doc = new PDFDocument();
        res.setHeader("Content-Disposition", `attachment; filename=payment_${paymentId}.pdf`);
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);

        doc.fontSize(20).text("Payment Receipt", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Payment ID: ${payment._id}`);
        doc.text(`User ID: ${payment.user}`);
        doc.text(`Amount: $${payment.amount.toFixed(2)}`);
        doc.text(`Status: ${payment.isActive ? "Active" : payment.status}`);
        doc.text(`Date: ${payment.createdAt?.toLocaleString() || "N/A"}`);
        doc.text(`Plan: ${payment.plan?.name || "N/A"}`);
        doc.moveDown();

        if (payment.plan?.features?.length > 0) {
            doc.text("Plan Features:");
            payment.plan.features.forEach((feature, i) => {
                doc.text(`  • ${feature}`);
            });
        }

        doc.end(); // Don't send any response after this
    } catch (error) {
        next(error); // let your error middleware handle this
    }
};