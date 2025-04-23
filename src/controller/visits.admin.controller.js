import { Visit } from "../model/visit.model.js";
import { Notification } from "../model/notfication.model.js";
import { createVisitService, getAllVisitsService, getCompletedVisitsWithIssuesService, getPastVisitsService, getUpcomingVisitsService, getVisits, getVisitsByType, getVisitsPagination, updateVisitService } from "../services/visit.services.js";
import mongoose from "mongoose";

//admin creates a visit for a client
export const createVisit = async (req, res, next) => {
    const { client, staff, type, address, date, plan, addsOnService } = req.body

    try {
        if (!client || !staff || !address || !date || !type || !plan) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        await createVisitService({ client, staff, type, address, date, plan, addsOnService }, client, res)

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

//admin gets all visits count
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

//admin gets all pending visits count
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

//admin gets all confirmed visits count
export const getConfirmedVisitsCount = async (_, res, next) => {

    try {
        const totalVisits = await Visit.countDocuments({ status: "confirmed" })

        return res.status(200).json({
            status: true,
            message: "Total confirmed visits count fetched successfully",
            total: totalVisits
        });
    }

    catch (error) {
        next(error)
    }
}

//admin gets all in progress visits count today
export const getInProgressVisitsCount = async (_, res, next) => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const todayVisits = await Visit.countDocuments({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: "confirmed"
        });

        return res.status(200).json({
            status: true,
            message: "Total in progress visits count fetched successfully",
            total: todayVisits
        });
    }
    catch (error) {
        next(error)
    }
}

//admin will gte all visits of a client
export const getAllVisits = async (req, res, next) => {

    const { client } = req.params
    const page = req.query.page || 1
    const limit = req.query.limit || 10

    try {
        await getAllVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all confirmed visits for a client
export const getConfirmedVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisits(client, "confirmed", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all pending visits for a client
export const getPendingVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisits(client, "pending", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all completed visits for a client
export const getCompletedVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisits(client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisitsPagination = async (req, res, next) => {

    const { client } = req.params
    const page = req.query.page || 1
    const limit = req.query.limit || 10

    try {
        await getVisitsPagination(page, limit, client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisitsWithIssues = async (req, res, next) => {

    const { client } = req.params
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getCompletedVisitsWithIssuesService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all cancelled visits for a client
export const getCancelledVisits = async (req, res, next) => {

    const { client } = req.params

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
    const { client } = req.params

    try {
        await getPastVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all upcoming visits for a client
export const getUpcomingVisits = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const { client } = req.params

    try {
        await getUpcomingVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all routine check visits for a client
export const getRoutineCheckVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisitsByType(client, "routine check", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all emergency visits for a client
export const getEmergencyVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisitsByType(client, "emergency", res)
    }

    catch (error) {
        next(error)
    }
}

//admin gets all follow up visits for a client
export const getFollowUpVisits = async (req, res, next) => {

    const { client } = req.params

    try {
        await getVisitsByType(client, "follow up", res)
    }

    catch (error) {
        next(error)
    }
}

//admin updates a specific visit for a client
export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { client, staff, address, date, type, notes, plan, addsOnService } = req.body

    try {
        const updatedVisit = await updateVisitService({ client, staff, address, date, type, notes, status: "confirmed", plan, addsOnService }, id, client, res).populate("client staff")

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
