import { Visit } from "../model/visit.model.js"
import { createVisitService, getPastVisitsService, getUpcomingVisitsService, getVisits, updateVisitService } from "../services/visit.services.js"

export const createVisit = async (req, res, next) => {

    const { address, date, type, plan, addsOnService } = req.body
    const client = req.user._id

    try {
        if (!address || !date || !type) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        await createVisitService({ address, date, type, plan, addsOnService }, client, res)

        return res.status(201).json({
            status: true,
            message: "Visit created successfully"
        })
    }

    catch (error) {
        next(error)
    }
}

export const getConfirmedVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "confirmed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getPendingVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "pending", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "cancelled", res)
    }

    catch (error) {
        next(error)
    }
}

export const getPastVisits = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const client = req.user._id

    try {
        await getPastVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getUpcomingVisits = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const client = req.user._id

    try {
        await getUpcomingVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getNextVisit = async (req, res, next) => {
    const client = req.user._id

    try {
        const visit =
            (await Visit.findOne({ client, date: { $gte: new Date() } })
                .sort({ date: 1 })
                .select("-createdAt -updatedAt -__v")
                .lean())

        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "No upcoming visits found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Next visit fetched successfully",
            data: visit
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { address, date, type, plan, addsOnService } = req.body
    const client = req.user._id

    try {
        const updatedVisit = await updateVisitService({ address, date, type, plan, addsOnService }, id, client, res)

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
