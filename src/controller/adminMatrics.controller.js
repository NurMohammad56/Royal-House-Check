import {
    getTotalActivePlans,
    getMonthlyRevenue,
    getActiveDiscounts,
    totalUser,
    totalAdmin,
    totalStaff
} from "../services/adminMatrics.services.js";

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

export const totalUserController = async (_, res, next) => {
    try {
        const total = await totalUser();
        return res.status(200).json({
            status: true,
            message: "Total users fetched successfully",
            data: total
        });
    } catch (error) {
        next(error);
    }
}

export const totalAdminController = async (_, res, next) => {
    try {
        const total = await totalAdmin();
        return res.status(200).json({
            status: true,
            message: "Total admins fetched successfully",
            data: total
        });
    } catch (error) {
        next(error);
    }
}

export const totalStaffController = async (_, res, next) => {
    try {
        const total = await totalStaff();
        return res.status(200).json({
            status: true,
            message: "Total staff fetched successfully",
            data: total
        });
    } catch (error) {
        next(error);
    }
}