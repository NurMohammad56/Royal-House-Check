import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";

export const addPlan = async (req, res, next) => {

    try {
        const plan = await Plan.create(req.body);

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
        const plans = await Plan.find().lean();

        // const populatedPlans = await Promise.all(
        //     plans.map(async (plan) => {
        //         const populatedAddOns = await AddsOnService.find({
        //             _id: { $in: plan.addsOnServices }
        //         })
        //             .select("-__v -createdAt -updatedAt -planId")
        //             .lean()

        //         return {
        //             ...plan,
        //             addsOnServices: populatedAddOns
        //         };
        //     })
        // );

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

export const getAPlan = async (req, res, next) => {

    const { id } = req.params;

    try {
        const plan = await Plan.findById(id)

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

    try {

        const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, { new: true })

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

export const deletePlan = async (req, res, next) => {

    const { id } = req.params;

    try {
        await Plan.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: "Plan deleted successfully"
        });
    }

    catch (error) {
        next(error);
    }
};

