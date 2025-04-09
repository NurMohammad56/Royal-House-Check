import mongoose from "mongoose"
import { Visit } from "../model/visit.model.js"

export const getVisitById = async (req, res, next) => {
    const { id } = req.params

    try {
        const visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findById(id).select("-createdAt -updatedAt -__v").lean()

        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "Visit not found"
            });
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

export const updateVisitStatus = async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    try {
        let visit

        //client or admin can cancel the visit
        if (status === "cancelled") {
            const { cancellationReason } = req.body
            visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findByIdAndUpdate(id, { status, cancellationReason }, { new: true }).select("-createdAt -updatedAt -__v")
        }

        //admin or staff can add notes for a completed visit
        if (status === "completed") {
            const { notes } = req.body
            visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findByIdAndUpdate(id, { status, notes }, { new: true }).select("-createdAt -updatedAt -__v")
        }

        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "Visit not found"
            })
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