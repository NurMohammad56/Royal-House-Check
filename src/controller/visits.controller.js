import { Visit } from "../model/visit.model.js"

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