import {
    getTotalActivePlans,
    getMonthlyRevenue,
    getActiveDiscounts,
    totalUser,
    totalAdmin,
    totalStaff,
    getActiveUsersCount,
    getPaymentGrowth,
    getRecentUserActivity,
    countInactiveUsers
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

export const getActiveUsersController = async (_, res, next) => {
    try {
        const total = await getActiveUsersCount();
        return res.status(200).json({
            status: true,
            message: "Fetched active users count for admin",
            data: total,
        });
    } catch (error) {
        console.error("Error getting active users count:", error);
        next(error);
    }
};
export const getInActiveUsersController = async (_, res, next) => {
    try {
        const total = await countInactiveUsers();
        return res.status(200).json({
            status: true,
            message: "Fetched inactive users count for admin",
            data: total,
        });
    } catch (error) {
        console.error("Error getting active users count:", error);
        next(error);
    }
};

export const getRevenueGrowthController = async (_, res, next) => {
    try {
        const growthData = await getPaymentGrowth();

        res.json({
            status: true,
            message: "Payment growth data fetched successfully",
            data: growthData
        });
    } catch (error) {
        next(error);
    }
}

export const getRecentUserActivityController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const recentActivity = await getRecentUserActivity(userId);

        return res.json({
            status: true,
            message: "Recent user activity fetched successfully",
            data: recentActivity
        });
    } catch (error) {
        next(error);
    }
}