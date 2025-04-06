import { Visit } from "../model/visit.model.js"
import { generateCode } from "../utils/generateCode.js"

export const createVisit = async (req, res, next) => {

    const { address, date, type } = req.body
    const client = req.user._id

    try {
        if (!address || !date || !type) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        let code;

        do {
            code = generateCode();

            visit = await Visit.findOne({ visitCode: code });
        } while (visit)

        const visit = await Visit.create({ visitCode: code, client, address, date, type })

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

export const getUpcomingVisits = async (_, res, next) => {

    const client = req.user._id
    try {
        const visits = await Visit.find({
            client, date: { $gte: Date.now() }, $or: [
                { status: "confirmed" },
                { status: "pending" }]
        }).select("-staff -address -type -notes")

        return res.status(200).json({
            status: true,
            message: "Upcoming visits fetched successfully",
            data: visits
        })
    }

    catch (error) {
        next(error)
    }
}

export const getSuccessfulVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        const visits = await Visit.find({ client, date: { $lt: Date.now() }, status: "complete" })

        return res.status(200).json({
            status: true,
            message: "Successful visits fetched successfully",
            data: visits
        })
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        const visits = await Visit.find({ client, date: { $lt: Date.now() }, status: "cancelled" })

        return res.status(200).json({
            status: true,
            message: "Cancelled visits fetched successfully",
            data: visits
        })
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

export const updateVisitStatus = async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    try {

        const visit = await Visit.findByIdAndUpdate(id, { status }, { new: true }).select("-client -staff -address -type -notes")

        if (status === "cancelled") {
            const { cancellationReason } = req.body
            visit.cancellationReason = cancellationReason
            await visit.save()
        }

        return res.status(200).json({
            status: true,
            message: "Visit status updated successfully",
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
