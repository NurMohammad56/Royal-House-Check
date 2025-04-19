import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";

export const addPlan = async (req, res, next) => {
    const { name, price, endDate } = req.body;
    const clientId = req.user._id;

    try {
        let plan

        //for weekly or monthly plan
        if (endDate) {
            if (new Date().getTime() >= new Date(endDate).getTime()) {
                return res.status(400).json({
                    status: false,
                    message: "Start date cannot be greater than or equal to end date"
                });
            }

            plan = await Plan.create({
                clientId,
                name,
                price,
                startDate: new Date(),
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
        const plans = await Plan.find().select("-__v -createdAt -updatedAt").lean();

        const populatedPlans = await Promise.all(
            plans.map(async (plan) => {
                const populatedAddOns = await AddsOnService.find({
                    _id: { $in: plan.addsOnServices }
                })
                    .select("-__v -createdAt -updatedAt -planId")
                    .lean()

                return {
                    ...plan,
                    addsOnServices: populatedAddOns
                };
            })
        );

        return res.status(200).json({
            status: true,
            message: "Plans fetched successfully",
            data: populatedPlans
        });
    }

    catch (error) {
        next(error);
    }
};

export const getAPlan = async (req, res, next) => {

    const { id } = req.params;

    try {
        const plan = await Plan.findById(id)
            .populate("addsOnServices")
            .select("-__v -createdAt -updatedAt")
            .lean();

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

export const updatePlan = async (req, res, next) => {
    const { id } = req.params;
    const { name, price, endDate } = req.body;

    try {
        let updatedPlan

        if (endDate) {
            if (new Date().getTime() >= new Date(endDate).getTime()) {
                return res.status(400).json({
                    status: false,
                    message: "Start date cannot be greater than or equal to end date"
                });
            }

            updatedPlan = await Plan.findByIdAndUpdate(id, {
                name,
                price,
                startDate: new Date(),
                endDate,
                isDeactivated: false
            }, { new: true })
                .select("-__v -createdAt -updatedAt")
                .lean()
        }

        else {
            updatedPlan = await Plan.findByIdAndUpdate(id, {
                name,
                price,
                startDate: null,
                endDate: null,
                isDeactivated: false
            }, { new: true })
                .select("-__v -createdAt -updatedAt")
                .lean()
        }

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

export const deactivatePlan = async (req, res, next) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findByIdAndUpdate(id, { isDeactivated: true }, { new: true })
            .lean();

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan deactivated successfully"
        });
    }

    catch (error) {
        next(error);
    }
};

export const activatePlan = async (req, res, next) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findByIdAndUpdate(id, { isDeactivated: false }, { new: true })
            .lean();

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan activated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

