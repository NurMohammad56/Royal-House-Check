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
  confirmedVisitCount as getConfirmedVisitCount,
} from '../services/adminMatrics.services.js'
import { Visit } from '../model/visit.model.js'
import { Payment } from '../model/payment.model.js'

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
      confirmedVisitCount,
    ] = await Promise.all([
      totalUser(),
      totalAdmin(),
      totalStaff(),
      getActiveUsersCount(),
      countInactiveUsers(),
      Visit.countDocuments({}),
      Visit.countDocuments({ status: 'pending' }),
      getMonthlyRevenue(),
      getCompletedVisitCount(),
      getConfirmedVisitCount(),
    ])

    return res.status(200).json({
      status: true,
      message: 'Admin metrics and monthly revenue fetched successfully',
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
        confirmedVisitCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

// controllers/revenueController.js
export const getRevenueGrowthController = async (req, res, next) => {
  try {
    const { range = '7d' } = req.query

    let data

    if (range === '1d') {
      data = await generateDailyRevenueData(1)
    } else if (range === '7d') {
      data = await generateDailyRevenueData(7)
    } else if (range === '30d') {
      data = await generateDailyRevenueData(30)
    } else if (range === '1y') {
      data = await generateMonthlyRevenueData(12)
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid range. Use '1d', '7d', '30d', or '1y'.",
      })
    }

    res.json({
      status: true,
      message: 'Revenue growth data fetched successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

// -----------------------------
// 📊 Daily Revenue Generator
// -----------------------------
async function generateDailyRevenueData(days) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - (days - 1))

  const payments = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' },
        },
        revenue: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const data = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const dateStr = date.toISOString().split('T')[0]

    const found = payments.find((p) => p._id === dateStr)
    data.push({
      date: dateStr,
      revenue: found ? parseFloat(found.revenue.toFixed(2)) : 0,
    })
  }

  return data
}

// -----------------------------
// 📅 Monthly Revenue Generator
// -----------------------------
async function generateMonthlyRevenueData(months) {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - (months - 1))
  startDate.setDate(1) 

  const payments = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$paymentDate' },
        },
        revenue: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const data = []
  const today = new Date()
  for (let i = 0; i < months; i++) {
    const date = new Date()
    date.setMonth(today.getMonth() - (months - i - 1))
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`

    const found = payments.find((p) => p._id === dateStr)
    data.push({
      date: dateStr,
      revenue: found ? parseFloat(found.revenue.toFixed(2)) : 0,
    })
  }

  return data
}


export const getRecentUserActivityController = async (req, res, next) => {
  try {
    const recentActivity = await getRecentUserActivity()

    return res.json({
      status: true,
      message: 'Recent user activity fetched successfully',
      data: recentActivity,
    })
  } catch (error) {
    next(error)
  }
}
