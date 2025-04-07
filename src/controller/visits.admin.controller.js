import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { createCode, getVisits } from "../services/visit.services.js";

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

        const visit = await Visit.create({ visitCode: code, client, staff, address, date, type });

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

export const getConfirmedVisits = async (_, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "confirmed", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getPendingVisits = async (_, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "pending", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisits = async (_, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "completed", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (_, res, next) => {

    const { client } = req.body

    try {
        await getVisits(client, "cancelled", res, next)
    }
    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { staff, address, date, type, notes } = req.body

    try {

        if (type === "completed" || type === "cancelled") {
            return res.status(400).json({
                status: false,
                message: "You cannot update the visit which is completed or cancelled"
            })
        }

        const visit = await Visit.findByIdAndUpdate(id, { staff, address, date, type, notes }, { new: true }).select("-client -status -notes")

        const formattedDate = new Date(visit.date).toLocaleString("en-US", {
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
            userId: visit.client,
            type: "visit update",
            message: `Visit log updated for ${visit.visitCode} (${formattedDate})`,
        });

        // Notify staff
        if (visit.staff) {
            await Notification.create({
                userId: visit.staff,
                type: "visit update",
                message: `Visit log updated for ${visit.visitCode} (${formattedDate})`,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Visit updated successfully",
            data: visit
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
        await Visit.findByIdAndUpdate(id, { staff, status: "confirmed" })

        return res.status(200).json({
            status: true,
            message: "Visit staff updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}
