import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { createVisitService, getVisits, updateVisitService } from "../services/visit.services.js";
import mongoose from "mongoose";

//admin creates a visit for a client
export const createVisit = async (req, res, next) => {
    const { client, staff, type, address, date } = req.body

    try {
        if (!client || !staff || !address || !date || !type) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        await createVisitService({ client, staff, type, address, date }, client, res)

        const formattedDate = new Date(date).toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        // Notify client
        await Notification.create({
            userId: client,
            type: "visit schedule",
            message: `Visit scheduled for ${formattedDate}`,
        });

        // Notify staff
        if (staff) {
            await Notification.create({
                userId: staff,
                type: "visit schedule",
                message: `Visit scheduled for ${formattedDate}`,
            });
        }

        return res.status(201).json({
            status: true,
            message: "Visit created successfully"
        })
    }

    catch (error) {
        next(error)
    }
}

//admin gets all visits count for a client
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

//admin gets all confirmed visits count for a client
export const getPendingVisitsCount = async (_, res, next) => {

    try {
        const totalVisits = await Visit.countDocuments({ status: "pending" })

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

//admin gets all confirmed visits for a client
export const getConfirmedVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "confirmed", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all pending visits for a client
export const getPendingVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "pending", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all completed visits for a client
export const getCompletedVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all cancelled visits for a client
export const getCancelledVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "cancelled", res)
    }
    catch (error) {
        next(error)
    }
}

//admin gets all past visits for a client
export const getPastVisits = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const client = req.user._id

    try {
        const visits = await Visit.find({
            client,
            date: { $lt: new Date() }
        })
            .sort({ date: -1 }) // most recent first
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Visit.countDocuments({
            client,
            date: { $lt: new Date() }
        });

        return res.status(200).json({
            status: true,
            message: "Past visits fetched successfully",
            data: visits,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    }

    catch (error) {
        next(error)
    }
}

//admin gets all upcoming visits for a client
export const getUpcomingVisits = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const client = req.user._id

    try {
        const visits = await Visit.find({
            client,
            date: { $gte: new Date() }
        })
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Visit.countDocuments({
            client,
            date: { $gte: new Date() }
        });

        return res.status(200).json({
            status: true,
            message: "Upcoming visits fetched successfully",
            data: visits,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    }

    catch (error) {
        next(error)
    }
}

//admin updates a specific visit for a client
export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { client, staff, address, date, type, notes } = req.body

    try {
        const updatedVisit = await updateVisitService({ client, staff, address, date, type, notes, status: "confirmed" }, id, client, res)

        const formattedDate = new Date(updatedVisit.date).toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        // Notify client
        await Notification.create({
            userId: updatedVisit.client,
            type: "visit update",
            message: `Visit log updated for ${updatedVisit.visitCode} (${formattedDate})`,
        });

        // Notify staff
        if (updatedVisit.staff) {
            await Notification.create({
                userId: updatedVisit.staff,
                type: "visit update",
                message: `Visit log updated for ${updatedVisit.visitCode} (${formattedDate})`,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Visit updated successfully",
            data: updatedVisit
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateVisitStaff = async (req, res, next) => {
    const { id } = req.params
    const { staff } = req.body

    try {
        const visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findByIdAndUpdate(id, { staff, status: "confirmed" }, { new: true }).lean()

        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "Visit not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Visit staff updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}
