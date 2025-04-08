import { Discount } from "../model/discount.model.js";

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

        if (!planID || !voucherCode || !description || !discountPercentage || !startDate || !endDate) {
            return res.status(400).json({
              status: false,
              message: "Missing required fields",
            });
          }

        // Create a new discount plan
        const discountPlan = new Discount({
            planID,
            voucherCode,
            description,
            discountPercentage,
            startDate,
            endDate,
        });

        await discountPlan.save();

        res.status(201).json({
            success: true,
            message: "Discount plan created successfully",
            discountPlan,
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
            message: "Discount deactivated successfully"
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
}

export const applyDiscount = async (req, res, next) => {
    try {
        const { discountCode } = req.body; 

        const discountPlan = await Discount.findOne({ discountCode: discountCode });

        // If no discount plan is found or it's inactive
        if (!discountPlan || !discountPlan.isActive) {
            return res.status(400).json({ success: false, message: "Invalid or inactive discount plan" });
        }

        // Check if the discount plan is still valid based on the date range
        const currentDate = new Date();
        if (currentDate < new Date(discountPlan.startDate) || currentDate > new Date(discountPlan.endDate)) {
            return res.status(400).json({ success: false, message: "Discount plan expired" });
        }

        // Apply the discount to the plan's price
        const discountedAmount = discountPlan.price - (discountPlan.price * discountPlan.discountPercentage / 100);

        res.status(200).json({
            status: true,
            message: "Discount applied successfully",
            data: discountedAmount, 
        });
    } catch (error) {
        next(error);
    }
};