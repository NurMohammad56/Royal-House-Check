import { Visit } from "../model/visit.model"


export const createVisit = async (req, res) => {

}

export const getUpcomingVisits = async (req, res, next) => {
    const { userId } = req.params
    const { date } = req.body

    try {
        const visits = await Visit.find({ client: userId, date: { $gte: date } })
            .populate('client', 'name email phone')
            .populate('staff', 'name email phone')
            .exec()

        return res.status(200).json({ message: "Visits fetched successfully", visits })
    }

    catch (error) {
        next(error)
    }
}

export const getSuccessfulVisits = async (req, res, next) => {
    const { userId } = req.params
    const { date } = req.body

    try {
        const visits = await Visit.find({ client: userId, date: { $lt: date } })
            .populate('client', 'name email phone')
            .populate('staff', 'name email phone')
            .exec()

        return res.status(200).json({ message: "Visits fetched successfully", visits })
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {
    const { userId } = req.params
    const { date } = req.body
    try {
        const visits = await Visit.find({ client: userId, date: { $lt: date }, status: "cancelled" })
            .populate('client', 'name email phone')
            .populate('staff', 'name email phone')
            .exec()

        return res.status(200).json({ message: "Visits fetched successfully", visits })
    }

    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { visitId } = req.params
    const { status } = req.body

    try {
        const visit = await Visit.findByIdAndUpdate(visitId, { status }, { new: true })
            .populate('client', 'name email phone')
            .populate('staff', 'name email phone')
            .exec()

        return res.status(200).json({ message: "Visit updated successfully", visit })
    }

    catch (error) {
        next(error)
    }
}