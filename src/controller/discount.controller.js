import { Discount } from "../model/discount.model.js";
import { Plan } from "../model/plan.model.js";

export const getAllDiscounts = async (_, res, next) => {
    try {
        const discounts = await Discount.find({ isActive: true }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Discounts fetched successfully",
            data: discounts
        });
    } catch (error) {
        next(error);
    }
};

export const addDiscount = async (req, res, next) => {
    try {
        const { planID, voucherCode, description, discountPercentage, startDate, endDate } = req.body;

        // Validate required fields
        const requiredFields = ['planID', 'voucherCode', 'description', 'discountPercentage', 'startDate', 'endDate'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate discount percentage
        if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
            return res.status(400).json({
                status: false,
                message: "Discount percentage must be a number between 0-100"
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return res.status(400).json({
                status: false,
                message: "End date must be after start date"
            });
        }

        // Check for existing voucher code (case insensitive)
        const existingDiscount = await Discount.findOne({
            voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') }
        });

        if (existingDiscount) {
            return res.status(400).json({
                status: false,
                message: "Voucher code already exists"
            });
        }

        // Create new discount
        const discountPlan = new Discount({
            planID,
            voucherCode: voucherCode.toUpperCase(), // Standardize to uppercase
            description,
            discountPercentage: parseFloat(discountPercentage),
            startDate: start,
            endDate: end,
            isActive: true
        });

        await discountPlan.save();

        res.status(201).json({
            status: true,
            message: "Discount created successfully",
            data: discountPlan
        });
    } catch (error) {
        next(error);
    }
};

export const applyDiscount = async (req, res, next) => {
    try {
        const { voucherCode, planID, subscriptionType } = req.body;

        // Validate required fields
        if (!voucherCode || !planID || !subscriptionType) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields: voucherCode, planID, or subscriptionType"
            });
        }

        // Find active discount
        const discountPlan = await Discount.findOne({
            voucherCode: { $regex: new RegExp(`^${voucherCode}$`, 'i') },
            planID,
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        if (!discountPlan) {
            return res.status(400).json({
                status: false,
                message: "Invalid or expired discount voucher"
            });
        }

        // Get plan
        const plan = await Plan.findById(planID);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        // Calculate amounts
        const baseAmount = subscriptionType === "monthly"
            ? parseFloat(plan.monthlyPrice.toString().replace(/[^0-9.]/g, ''))
            : parseFloat(plan.yearlyPrice.toString().replace(/[^0-9.]/g, ''));

        const discountAmount = parseFloat((baseAmount * (discountPlan.discountPercentage / 100)).toFixed(2));
        const finalAmount = parseFloat((baseAmount - discountAmount).toFixed(2));

        return res.status(200).json({
            status: true,
            message: "Discount applied successfully",
            data: {
                voucherCode: discountPlan.voucherCode,
                discountPercentage: discountPlan.discountPercentage,
                originalAmount: baseAmount,
                discountAmount,
                finalAmount,
                validUntil: discountPlan.endDate
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateDiscount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const discount = await Discount.findByIdAndUpdate(id, updates, { new: true });
        if (!discount) {
            return res.status(404).json({ status: false, message: "Discount not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Discount updated successfully",
            data: discount
        });
    } catch (error) {
        next(error);
    }
};

export const deactivteDiscount = async (req, res, next) => {
    try {
        const { id } = req.params;

        const discount = await Discount.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!discount) {
            return res.status(404).json({ status: false, message: "Discount not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Discount deactivated successfully",
            data: discount
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDiscount = async (req, res, next) => {
    try {
        const { id } = req.params;

        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) {
            return res.status(404).json({ status: false, message: "Discount not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Discount deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getDiscountById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const discount = await Discount.findById(id);
        if (!discount) {
            return res.status(404).json({ status: false, message: "Discount not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Discount fetched successfully",
            data: discount
        });
    } catch (error) {
        next(error);
    }
};