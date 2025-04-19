import { Plan } from "../model/plan.model.js";

export const addPlan = async (req, res, next) => {
    const { name, price, startDate, endDate } = req.body;
    const clientId = req.user._id;

    try {
        let plan

        //for weekly or monthly plan
        if (startDate && endDate) {
            if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
                return res.status(400).json({
                    status: false,
                    message: "Start date cannot be greater than or equal to end date"
                });
            }

            plan = await Plan.create({
                clientId,
                name,
                price,
                startDate,
                endDate
            });
        }

        //for per visit plan
        else {
            plan = await Plan.create({
                clientId,
                name,
                price
            });
        }

        return res.status(201).json({
            status: true,
            message: "Plan created successfully",
            data: plan
        });
    }

    catch (error) {
        next(error);
    }
};

export const getAllPlans = async (_, res, next) => {

    try {
        const plans = await Plan.find()
        return res.status(200).json({
            status: true,
            message: "Plans fetched successfully",
            data: plans
        });
    }

    catch (error) {
        next(error);
    }
};

export const updatePlan = async (req, res, next) => {
    const { id } = req.params;
    const { name, price, startDate, endDate } = req.body;

    try {

        const updatedPlan = await Plan.findByIdAndUpdate(id, {
            name,
            price,
            startDate,
            endDate
        }, { new: true })

        return res.status(200).json({
            status: true,
            message: "Plan updated successfully",
            data: updatedPlan
        });
    }

    catch (error) {
        next(error);
    }
};

export const getAPlan = async (req, res, next) => {

    const { id } = req.params;

    try {
        const plan = await Plan.findById(id).populate("addsOnServices");

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan fetched successfully",
            data: plan
        });
    }

    catch (error) {
        next(error);
    }
}

export const deletePlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByIdAndDelete(id);

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan deleted successfully"
        });
    }

    catch (error) {
        next(error);
    }
};

