import {Plan} from "../model/plan.model.js";
import {Payment} from "../model/payment.model.js";
import {Discount} from "../model/discount.model.js";
import moment from "moment";

export const getTotalActivePlans = async () => {
    return await Plan.countDocuments({ isActive: true });
};

export const getMonthlyRevenue = async () => {
    const startOfMonth = moment().startOf('month').toDate();  
    const endOfMonth = moment().endOf('month').toDate();      

    console.log("Start of month:", startOfMonth);
    console.log("End of month:", endOfMonth);

    try {
        const monthlyRevenue = await Payment.aggregate([
            {
                $match: {
                    status: "success", 
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
export const getActiveDiscounts = async () => {
    return await Discount.countDocuments({ isActive: true });
};
