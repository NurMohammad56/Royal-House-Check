import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";

export const addAddsOnService = async (req, res, next) => {
    const { id } = req.params;
    const { addOn, price, startDate, endDate } = req.body;

    try {
        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        const addsOnService = await AddsOnService.create({
            addOn,
            price,
            startDate,
            endDate
        });

        plan.addsOnServices.push(addsOnService._id);
        await plan.save();

        return res.status(201).json({
            status: true,
            message: "Adds on service added successfully",
            data: addsOnService
        });
    }

    catch (error) {
        next(error);
    }
}