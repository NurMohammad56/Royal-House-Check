import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";


export const createAddsOnService = async (req, res, next) => {
    try {
        const addsOnService = await AddsOnService.create(req.body);

        return res.status(201).json({
            status: true,
            data: addsOnService,
            message: "Service created successfully"
        });
    }

    catch (error) {
        next(error)
    }
};

export const getAllAddsOnServices = async (req, res, next) => {
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

export const addServiceToPlan = async (req, res, next) => {
    const { planId, serviceId } = req.params;

    try {
        // Find the plan and verify the service exists
        const plan = await Plan.findById(planId);
        const service = await AddsOnService.findById(serviceId);

        if (!plan || !service) {
            return res.status(404).json({
                status: false,
                message: "Plan or Service not found"
            });
        }

        // Check if service is already added
        if (plan.addsOnServices.includes(serviceId)) {
            return res.status(400).json({
                status: false,
                message: "Service already added to this plan"
            });
        }

        // Add service to the plan
        plan.addsOnServices.push(serviceId);
        await plan.save();

        // Return the updated plan with calculated total
        const populatedPlan = await Plan.findById(planId)
            .populate('addsOnServices', 'name price');

        const totalAmount = populatedPlan.price +
            populatedPlan.addsOnServices.reduce((sum, service) => sum + service.price, 0);

        return res.status(200).json({
            status: true,
            message: "Service added to plan successfully",
            data: {
                plan: {
                    _id: populatedPlan._id,
                    name: populatedPlan.name,
                    basePrice: populatedPlan.price,
                    totalAmount,
                    pack: populatedPlan.pack,
                    services: populatedPlan.addsOnServices
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const removeServiceFromPlan = async (req, res, next) => {
    const { planId, serviceId } = req.params;

    try {
        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        // Remove service and update total price
        plan.addsOnServices = plan.addsOnServices.filter(
            id => id.toString() !== serviceId
        );

        plan.totalPrice = plan.price +
            (await AddsOnService.find({ _id: { $in: plan.addsOnServices } }))
                .reduce((sum, service) => sum + service.price, 0);

        await plan.save();

        return res.status(200).json({
            status: true,
            message: "Service removed from plan successfully",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

export const getPlanWithTotal = async (req, res, next) => {
    const { planId } = req.params;

    try {
        const plan = await Plan.findById(planId)
            .populate('addsOnServices', 'name price description');

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        const totalAmount = plan.price +
            plan.addsOnServices.reduce((sum, service) => sum + service.price, 0);

        return res.status(200).json({
            status: true,
            message: "Plan with total amount fetched successfully",
            data: {
                ...plan.toObject(),
                totalAmount
            }
        });
    } catch (error) {
        next(error);
    }
};