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
        const plans = await Plan.find()
            .populate({
                path: 'addsOnServices',
                select: '-__v -createdAt -updatedAt'
            })
            .lean();

        return res.status(200).json({
            status: true,
            message: "Plans fetched successfully",
            data: plans
        });
    } catch (error) {
        next(error);
    }
};

export const getAPlan = async (req, res, next) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findById(id)
            .populate({
                path: 'addsOnServices',
                select: '-__v -createdAt -updatedAt'
            });

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
    } catch (error) {
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

