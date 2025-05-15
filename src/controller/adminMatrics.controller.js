import { Payment } from "../model/payment.model.js";

import {
  getMonthlyRevenue,
  totalUser,
  totalAdmin,
  totalStaff,
  getActiveUsersCount,
  getPaymentGrowth,
  getRecentUserActivity,
  countInactiveUsers,
  completedVisitCount as getCompletedVisitCount,
  confirmedVisitCount as getConfirmedVisitCount
} from "../services/adminMatrics.services.js";
import { Visit } from "../model/visit.model.js";

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
      monthlyRevenue,
      completedVisitCount,
      confirmedVisitCount
    ] = await Promise.all([
      totalUser(),
      totalAdmin(),
      totalStaff(),
      getActiveUsersCount(),
      countInactiveUsers(),
      Visit.countDocuments({}),
      Visit.countDocuments({ status: "pending" }),
      getMonthlyRevenue(),
      getCompletedVisitCount(),
      getConfirmedVisitCount(),
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
        monthlyRevenue,
        completedVisitCount,
        confirmedVisitCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// controllers/revenueController.js
export const getRevenueGrowthController = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;

    let matchStage = { status: "completed" };
    let groupStage = {};
    let projectStage = {};
    let formatDate = {};

    const today = new Date();
    let startDate;

    if (range === "1d") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      formatDate = { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } };
    } else if (range === "7d") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      formatDate = { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } };
    } else if (range === "30d") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
      formatDate = { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } };
    } else if (range === "1y") {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      formatDate = { $dateToString: { format: "%Y-%m", date: "$paymentDate" } };
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid range. Use '1d', '7d', '30d', or '1y'."
      });
    }

    // Add date filter
    matchStage.paymentDate = { $gte: startDate };

    // Group by day or month depending on range
    groupStage = {
      _id: formatDate,
      totalRevenue: { $sum: "$amount" },
    };

    // Format the response
    projectStage = {
      _id: 0,
      date: "$_id",
      revenue: { $round: ["$totalRevenue", 2] }
    };

    const data = await Payment.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $project: projectStage },
      { $sort: { date: 1 } }
    ]);

    return res.json({
      status: true,
      message: "Revenue growth data fetched successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};



export const getRecentUserActivityController = async (req, res, next) => {
  try {

    const recentActivity = await getRecentUserActivity();

    return res.json({
      status: true,
      message: "Recent user activity fetched successfully",
      data: recentActivity
    });
  } catch (error) {
    next(error);
  }
}


