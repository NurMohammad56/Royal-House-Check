import { AddsOnService } from "../model/addsOnService.model.js";
import { Plan } from "../model/plan.model.js";
import { UserPlan } from '../model/userPlan.models.js';


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

export const addServiceToPlan = async (req, res, next) => {
    const { planId, serviceId } = req.params;

    const userId = req.user._id;


    try {
        // Verify plan and service exist
        const plan = await Plan.findById(planId);
        const service = await AddsOnService.findById(serviceId);

        if (!plan || !service) {
            return res.status(404).json({
                status: false,
                message: "Plan or Service not found"
            });
        }

        // Find or create user plan configuration
        let userPlan = await UserPlan.findOne({ user: userId, plan: planId });

        if (!userPlan) {
            userPlan = await UserPlan.create({
                user: userId,
                plan: planId,
                addOnServices: []
            });
        }

        // Check if service is already added
        if (userPlan.addOnServices.includes(serviceId)) {
            return res.status(400).json({
                status: false,
                message: "Service already added to your plan"
            });
        }

        // Add service to user's plan configuration
        userPlan.addOnServices.push(serviceId);
        await userPlan.save();

        // Calculate total
        const addOnServices = await AddsOnService.find({ _id: { $in: userPlan.addOnServices } });
        const totalAmount = plan.price + addOnServices.reduce((sum, service) => sum + service.price, 0);

        return res.status(200).json({
            status: true,
            message: "Service added to your plan successfully",
            data: {
                plan: {
                    _id: plan._id,
                    name: plan.name,
                    price: plan.price,
                    pack: plan.pack
                },
                addOnServices: await AddsOnService.find({ _id: { $in: userPlan.addOnServices } }),
                totalAmount
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserPlanConfiguration = async (req, res, next) => {
    const {  planId } = req.params;

    const userId = req.user._id;

    try {
        const plan = await Plan.findById(planId)
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        const userPlan = await UserPlan.findOne({ user: userId, plan: planId })
            .populate('addOnServices', 'name price description');

        const addOnServices = userPlan?.addOnServices || [];
        const totalAmount = plan.price +
            addOnServices.reduce((sum, service) => sum + service.price, 0);

        return res.status(200).json({
            status: true,
            message: "User plan configuration fetched successfully",
            data: {
                plan,
                addOnServices,
                totalAmount
            }
        });
    } catch (error) {
        next(error);
    }
};