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
        const { name, percentage, fromDate, toDate } = req.body;

        const discount = await Discount.create({
            name,
            percentage,
            fromDate,
            toDate,
        });

        return res.status(201).json({
            status: true,
            message: "Discount added successfully",
            data: discount
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