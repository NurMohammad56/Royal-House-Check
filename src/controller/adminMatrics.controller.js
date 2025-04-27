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

// controllers/revenueController.js

export const getRevenueGrowthController = async (req, res, next) => {
    try {
      const { range = "7d" } = req.query
  
      let data
  
      if (range === "7d") {
        data = generateDailyData(7)
      } else if (range === "1d") {
        data = generateDailyData(1);
      }
      else if (range === "30d") {
        data = generateDailyData(30)
      } else if (range === "1y") {
        data = generateMonthlyData(12)
      } else {
        return res.status(400).json({
          status: false,
          message: "Invalid range. Use '7d', '30d', or '1y'."
        })
      }
  
      res.json({
        status: true,
        message: "Payment growth data fetched successfully",
        data
      })
    } catch (error) {
      next(error)
    }
  }
  
  // Helpers
  function generateDailyData(days) {
    const today = new Date()
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - i - 1))
      return {
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 1000) + 200
      }
    })
  }
  
  function generateMonthlyData(months) {
    const today = new Date()
    return Array.from({ length: months }).map((_, i) => {
      const date = new Date(today)
      date.setMonth(today.getMonth() - (months - i - 1))
      return {
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        revenue: Math.floor(Math.random() * 30000) + 5000
      }
    })
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


