import { activePlan } from "../model/activePlans.model";

export const getAllActivePlans = async (_, res, next) => {
    try {
        const activePlans = await activePlan.find().lean();

        return res.status(200).json({
            status: true,
            message: "All active plans fetched successfully",
            data: activePlans,
        });
    } catch (error) {
        next(error);
    }
};

export const getActivePlanById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const activePlan = await activePlan.findById(id).lean();

        if (!activePlan) {
            return res.status(404).json({
                status: false,
                message: "Active plan not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active plan fetched successfully",
            data: activePlan,
        });
    }

    catch (error) {
        next(error);
    }
};

export const createActivePlan = async (req, res, next) => {
    try {
        const { userId, activePlans } = req.body;

        const newActivePlan = await activePlan.create({
            userId,
            activePlans
        });

        return res.status(201).json({
            status: true,
            message: "Active plan created successfully",
            data: newActivePlan,
        });
    }

    catch (error) {
        next(error);
    }
};

export const createAddsOnServicePlan = async (req, res, next) => {
    try {
        const { userId, activeServices } = req.body;

        const newActivePlan = await activePlan.create({
            userId,
            activeServices
        });

        return res.status(201).json({
            status: true,
            message: "Active plan created successfully",
            data: newActivePlan,
        });
    }

    catch (error) {
        next(error);
    }
};

export const addActivePlanOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const { planId } = req.body;
    try {

        const addActivePlan = await activePlan.findOneAndUpdate(
            { userId },
            {
                $push: { activePlans: { planId } },
            },
            { new: true }
        );

        if (!addActivePlan) {
            return res.status(404).json({
                status: false,
                message: "Active plan not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active plan updated successfully",
            data: addActivePlan,
        });
    }

    catch (error) {
        next(error);
    }
};

export const deleteActivePlanOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const { planId } = req.body;
    try {
        const updated = await activePlan.findOneAndUpdate(
            { userId },
            {
                $pull: { activePlans: { planId } },
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: "Active plan not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active plan removed successfully",
            data: updated,
        });
    }

    catch (error) {
        next(error);
    }
};

export const addActiveServiceOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const { serviceId } = req.body;
    try {

        const addActivePlan = await activePlan.findOneAndUpdate(
            { userId },
            {
                $push: { activeServices: { serviceId } },
            },
            { new: true }
        );

        if (!addActivePlan) {
            return res.status(404).json({
                status: false,
                message: "Active plan not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active plan updated successfully",
            data: addActivePlan,
        });
    }

    catch (error) {
        next(error);
    }
};

export const deleteActiveServiceOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const { serviceId } = req.body;
    try {
        const updated = await activePlan.findOneAndUpdate(
            { userId },
            {
                $pull: { activeServices: { serviceId } },
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: "Active plan not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active plan removed successfully",
            data: updated,
        });
    }

    catch (error) {
        next(error);
    }
};
