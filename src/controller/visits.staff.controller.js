import { Visit } from "../model/visit.model.js"

export const updateVisitNotes = async (req, res, next) => {

    const { id } = req.params
    const { notes } = req.body

    try {
        await Visit.findByIdAndUpdate(id, { notes }).lean()

        return res.status(200).json({
            status: true,
            message: "Visit notes updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}