import {
    getTotalActivePlans,
    getMonthlyRevenue,
    getActiveDiscounts,
} from "../services/adminMatricsServices.js";

export const totalActivePlansController = async (_, res, next) => {
    try {
        const total = await getTotalActivePlans();
        return res.status(200).json({
            status: true,
            message: "Total active plans fetched successfully",
            totalActivePlans: total
        });
    } catch (error) {
        next(error);
    }
};

export const monthlyRevenueController = async (_, res, next) => {
    try {
        const revenue = await getMonthlyRevenue();
        return res.status(200).json({
            status: true,
            message: "Monthly revenue fetched successfully",
            monthlyRevenue: revenue
        });
    } catch (error) {
        next(error);
    }
};

export const activeDiscountsController = async (_, res, next) => {
    try {
        const discounts = await getActiveDiscounts();
        return res.status(200).json({
            status: true,
            message: "Active discounts fetched successfully",
            activeDiscounts: discounts
        });
    } catch (error) {
        next(error);
    }
};
