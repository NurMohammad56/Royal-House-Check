import { Visit } from "../model/visit.model.js";
import { createCode } from "../services/visit.services.js";

export const createVisit = async (req, res, next) => {
    const { client, staff, type, address, date } = req.body

    try {
        if (!client || !staff || !address || !date || !type) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        const code = await createCode(next)

        const visit = await Visit.create({ visitCode: code, client, staff, address, date, type })

        return res.status(201).json({
            status: true,
            message: "Visit created successfully",
            data: visit
        })
    }

    catch (error) {
        next(error)
    }
}

export const getAllVisitsCount = async (_, res, next) => {

    try {
        const totalVisits = await Visit.countDocuments();

        return res.status(200).json({
            status: true,
            message: "Total visits count fetched successfully",
            total: totalVisits
        });
    }

    catch (error) {
        next(error);
    }
}

export const getPendingVisitsCount = async (_, res, next) => {

    try {
        const totalVisits = await Visit.countDocuments({ status: "pending" });

        return res.status(200).json({
            status: true,
            message: "Total pending visits count fetched successfully",
            total: totalVisits
        });
    }

    catch (error) {
        next(error)
    }
}

export const getAllConfirmedVisits = async (_, res, next) => {

    try {
        const upcomingVisits = await Visit.find({ status: "confirmed" }).sort({ date: 1 })

        return res.status(200).json({
            status: true,
            message: "All upcoming visits fetched successfully",
            data: upcomingVisits
        });
    }

    catch (error) {
        next(error)
    }
}

export const getAllPendingVisits = async (_, res, next) => {

    try {
        const upcomingVisits = await Visit.find({ status: "pending" }).sort({ date: 1 })

        return res.status(200).json({
            status: true,
            message: "All upcoming visits fetched successfully",
            data: upcomingVisits
        });
    }

    catch (error) {
        next(error)
    }
}

export const getAllCompleteVisits = async (_, res, next) => {

    try {
        const successfulVisits = await Visit.find({ status: "complete" }).sort({ date: 1 })

        return res.status(200).json({
            status: true,
            message: "All successful visits fetched successfully",
            data: successfulVisits
        });
    }

    catch (error) {
        next(error)
    }
}

export const getAllCancelledVisits = async (_, res, next) => {

    try {
        const cancelledVisits = await Visit.find({ status: "cancelled" }).sort({ date: 1 })

        return res.status(200).json({
            status: true,
            message: "All cancelled visits fetched successfully",
            data: cancelledVisits
        });
    }
    catch (error) {
        next(error)
    }
}

export const updateVisitStaff = async (req, res, next) => {
    const { id } = req.params
    const { staffId } = req.body

    try {
        await Visit.findByIdAndUpdate(id, { staff: staffId, status: "confirmed" })

        return res.status(200).json({
            status: true,
            message: "Visit staff updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}