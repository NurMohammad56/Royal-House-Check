import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";

export const addAddsOnService = async (req, res, next) => {
    const { planId } = req.params;
    const { addOn, price, endDate } = req.body;

    try {
        let addsOnService;
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        // for weekly or monthly services
        if (endDate) {
            if (new Date().getTime() >= new Date(endDate).getTime()) {
                return res.status(400).json({
                    status: false,
                    message: "Start date cannot be greater than or equal to end date"
                });
            }

            addsOnService = await AddsOnService.create({
                addOn,
                price,
                startDate: new Date(),
                endDate,
                planId
            });
        }
        // for per visits services
        else {
            addsOnService = await AddsOnService.create({
                addOn,
                price,
                planId
            });
        }

        // Ensure addsOnServices is an array
        if (!Array.isArray(plan.addsOnServices)) {
            plan.addsOnServices = [];
        }

        plan.addsOnServices.push(addsOnService._id);
        await plan.save();

        return res.status(201).json({
            status: true,
            message: "Adds on service added successfully",
            data: addsOnService
        });
    } catch (error) {
        next(error);
    }
};