import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { createCode, getVisits, updateVisitService } from "../services/visit.services.js";
import mongoose from "mongoose";

export const createVisit = async (req, res, next) => {
    const { client, staff, type, address, date } = req.body

    try {
        if (!client || !staff || !address || !date || !type) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        if (new Date(date).getTime() < new Date().getTime()) {
            return res.status(400).json({
                status: false,
                message: "Visit date must be in the future"
            })
        }

        const visit = await Visit.findOne({ client, date })

        if (visit) {
            return res.status(400).json({
                status: false,
                message: "A visit with the same date already exists"
            })
        }

        const code = await createCode()

        await Visit.create({ visitCode: code, client, staff, address, date, type });

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

export const getConfirmedVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "confirmed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getPendingVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "pending", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "cancelled", res)
    }
    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { client, staff, address, date, type, notes } = req.body

    try {
        const updatedVisit = await updateVisitService({ client, staff, address, date, type, notes }, id, client, res, next)

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
        const visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findByIdAndUpdate(id, { staff, status: "confirmed" }, { new: true })

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
