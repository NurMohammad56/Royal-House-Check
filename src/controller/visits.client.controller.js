import { Visit } from "../model/visit.model.js"
import { createCode, getVisits } from "../services/visit.services.js"

export const createVisit = async (req, res, next) => {

    const { address, date, type } = req.body
    const client = req.user.id

    try {
        if (!address || !date || !type) {
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

        const code = await createCode(next)

        await Visit.create({ visitCode: code, client, address, date, type })

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

    const client = req.user.id
    try {
        await getVisits(client, "confirmed", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getPendingVisits = async (req, res, next) => {

    const client = req.user.id
    try {
        await getVisits(client, "pending", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisits = async (req, res, next) => {

    const client = req.user.id
    try {
        await getVisits(client, "completed", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {

    const client = req.user.id
    try {
        await getVisits(client, "cancelled", res, next)
    }

    catch (error) {
        next(error)
    }
}

export const getVisitById = async (req, res, next) => {
    const { id } = req.params

    try {
        const visit = await Visit.findById(id)

        if (!visit) {
            return res.status(404).json({ message: "Visit not found" })
        }

        return res.status(200).json({
            status: true,
            message: "Visit fetched successfully",
            data: visit
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { address, date, type } = req.body

    try {
        const visit = await Visit.findByIdAndUpdate(id, { address, date, type }, { new: true }).select("-client -status -notes")

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

export const updateVisitNotes = async (req, res, next) => {

    const { id } = req.params
    const { notes } = req.body

    try {
        await Visit.findByIdAndUpdate(id, { notes })

        return res.status(200).json({
            status: true,
            message: "Visit notes updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}
