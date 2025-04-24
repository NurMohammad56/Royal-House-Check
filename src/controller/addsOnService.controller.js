import { AddsOnService } from "../model/addsOnService.model.js";


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