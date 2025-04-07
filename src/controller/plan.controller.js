import { Plan } from "../model/plan.model.js";

export const getAllPlans = async (_, res, next) => {
    try {
        const plans = await Plan.find({ isActive: true }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Plans fetched successfully",
            data: plans
        });
    } catch (error) {
        next(error);
    }
};

export const addPlan = async (req, res, next) => {
    try {
        const { name, amount, features } = req.body;

        const plan = await Plan.create({
            name,
            amount,
            features,
        });

        return res.status(201).json({
            status: true,
            message: "Plan created successfully",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

export const updatePlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const plan = await Plan.findByIdAndUpdate(id, updates, { new: true });

        if (!plan) {
            return res.status(404).json({ status: false, message: "Plan not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Plan updated successfully",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

export const deletePlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByIdAndUpdate(id, { isActive: false }, { new: true });

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
    } catch (error) {
        next(error);
    }
};