import {Plan} from "../model/plan.model.js";
import {Payment} from "../model/payment.model.js";
import {Discount} from "../model/discount.model.js";
import moment from "moment";

export const getTotalActivePlans = async () => {
    return await Plan.countDocuments({ isActive: true });
};

export const getMonthlyRevenue = async () => {
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const monthlyRevenue = await Payment.aggregate([
        {
            $match: {
                status: "successful", 
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

    return monthlyRevenue[0]?.totalAmount || 0; 
};

export const getActiveDiscounts = async () => {
    return await Discount.countDocuments({ isActive: true });
};
