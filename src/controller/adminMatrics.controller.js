import {
    getMonthlyRevenue,
    totalUser,
    totalAdmin,
    totalStaff,
    getActiveUsersCount,
    getPaymentGrowth,
    getRecentUserActivity,
    countInactiveUsers
} from "../services/adminMatrics.services.js";
import {Visit} from "../model/visit.model.js";

export const getAdminMetricsAndRevenueController = async (_, res, next) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalStaffMembers,
            activeUsersCount,
            inactiveUsersCount,
            totalVisits,
            pendingVisits,
            monthlyRevenue
        ] = await Promise.all([
            totalUser(),
            totalAdmin(),
            totalStaff(),
            getActiveUsersCount(),
            countInactiveUsers(),
            Visit.countDocuments({}),
            Visit.countDocuments({ status: "pending" }),
            getMonthlyRevenue()
        ]);

        return res.status(200).json({
            status: true,
            message: "Admin metrics and monthly revenue fetched successfully",
            data: {
                totalUsers,
                totalAdmins,
                totalStaffMembers,
                activeUsersCount,
                inactiveUsersCount,
                totalVisits,
                pendingVisits,
                monthlyRevenue
            }
        });
    } catch (error) {
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


