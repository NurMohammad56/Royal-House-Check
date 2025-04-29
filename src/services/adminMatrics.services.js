import { Plan } from "../model/plan.model.js";
import { Payment } from "../model/payment.model.js";
import { Discount } from "../model/discount.model.js";
import { User } from "../model/user.model.js";
import moment from "moment";
import { Visit } from "../model/visit.model.js";


// Get monthly revenue
export const getMonthlyRevenue = async () => {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    try {
        const monthlyRevenue = await Payment.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);


        // If there are no payments for the month, return 0
        return monthlyRevenue[0]?.totalAmount || 0;
    } catch (error) {
        console.error("Error calculating monthly revenue:", error);
        throw new Error("Error calculating monthly revenue");
    }
}

// Get active discounts count
export const getActiveDiscounts = async () => {
    return await Discount.countDocuments({ isActive: true });
};

// Total user count
export const totalUser = async () => {
    return await User.countDocuments({ role: "client" })
}

// Total admin count
export const totalAdmin = async () => {
    return await User.countDocuments({ role: "admin" });
}

// Total staff count
export const totalStaff = async () => {
    return await User.countDocuments({ role: "staff" });
}

// Total active users count
export const getActiveUsersCount = async () => {
    try {

        const count = await User.countDocuments({ status: "active" });
        return count;
    } catch (error) {
        console.error("Error getting active users count:", error);
    }
}

export const countInactiveUsers = async () => {
    try {

        const count = await User.countDocuments({ status: "inactive" });
        return count;
    } catch (error) {
        console.error("Error getting active users count:", error);
    }
};

export const getPaymentGrowth = async (next) => {
    try {
        const now = new Date();

        // Date ranges
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(now.getMonth() - 12);

        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        // Parallel aggregation queries
        const [
            twelveMonthsData,
            sixMonthsData,
            thirtyDaysData,
            sevenDaysData,
            monthlyData
        ] = await Promise.all([
            Payment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: twelveMonthsAgo },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),
            Payment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sixMonthsAgo },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),
            Payment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: thirtyDaysAgo },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),
            Payment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),
            Payment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: twelveMonthsAgo },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ])
        ]);

        // Format monthly data for chart
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthlyData.map(item => ({
            month: `${months[item._id.month - 1]} ${item._id.year}`,
            total: item.total
        }));

        return {
            periods: {
                twelveMonths: twelveMonthsData[0]?.total || 0,
                sixMonths: sixMonthsData[0]?.total || 0,
                thirtyDays: thirtyDaysData[0]?.total || 0,
                sevenDays: sevenDaysData[0]?.total || 0
            },
            chartData
        };
    } catch (error) {
        next(error);
    }
};

export const getRecentUserActivity = async (userId) => {
    try {

        const recentPayments = await Payment.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("plan", "name price")
            .populate("user", "fullname email")
            .lean();

        return recentPayments;

    } catch (error) {
        throw new Error("Unable to fetch recent user activity. Please try again later.");
    }
};

export const completedVisitCount = async () => {
    try {
        const count = await Visit.countDocuments({ status: "completed" });
        return count;
    } catch (error) {
        console.error("Error getting completed visit count:", error);
    }
};

export const  confirmedVisitCount = async () => {
    try {
        const count = await Visit.countDocuments({ status: "confirmed" });
        return count;
    } catch (error) {
        console.error("Error getting confirmed visit count:", error);
    }
};