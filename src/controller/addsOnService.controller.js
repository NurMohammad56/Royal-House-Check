import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";


export const createAddsOnService = async (req, res, next) => {
    try {
        const { planId, addOn, price, endDate } = req.body; // Destructure required fields from req.body
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
        // Removed duplicate declaration of addsOnService

        return res.status(201).json({
            status: true,
            data: addsOnService,
            message: "Service created successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllAddsOnServices = async (_req, res, next) => { // Renamed 'req' to '_req' to indicate it's unused
    try {
        const services = await AddsOnService.find()
        return res.status(200).json({
            status: true,
            data: services,
            message: "Services fetched successfully"
        });
    }

    catch (error) {
        next(error)
    }
};

export const getAddsOnServiceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const service = await AddsOnService.findById(id);
        if (!service) {
            return res.status(404).json({
                status: false,
                message: "Service not found"
            });
        }

        return res.status(200).json({
            status: true,
            data: service,
            message: "Service fetched successfully"
        });
    }

    catch (error) {
        next(error)
    }
};

export const updateAddsOnService = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updatedService = await AddsOnService.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ status: false, message: "Service not found" });
        }

        return res.status(200).json({
            status: true,
            data: updatedService,
            message: "Service updated successfully"
        });
    }

    catch (error) {
        next(error)
    }
};

export const deleteAddsOnService = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedService = await AddsOnService.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({
                status: false,
                message: "Service not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Service deleted successfully"
        });
    }

    catch (error) {
        next(error)
    }
};
