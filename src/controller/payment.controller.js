import { Payment } from "../model/payment.model.js";
import { User } from "../model/user.model.js";
import { Plan } from "../model/plan.model.js";

export const getPaymentHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const payments = await Payment.find()
            .populate("user", "fullname email")
            .populate("plan", "name amount")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPayments = await Payment.countDocuments();

        res.status(200).json({
            success: true,
            data: payments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPayments / limit),
                totalItems: totalPayments,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};