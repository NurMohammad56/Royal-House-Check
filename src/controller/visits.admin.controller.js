import { Visit } from "../model/visit.model.js";

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
        const totalVisits = await Visit.countDocuments({ status: "pending" });

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

export const getAllUpcomingVisits = async (_, res, next) => {

    try {
        const upcomingVisits = await Visit.find({ date: { $gte: Date.now() } }).sort({ date: 1 });

        return res.status(200).json({
            status: true,
            message: "All upcoming visits fetched successfully",
            data: upcomingVisits
        });
    }

    catch (error) {
        next(error)
    }
}
export const getAllSuccessfulVisits = async (_, res, next) => {

    try {
        const successfulVisits = await Visit.find({ status: "complete" }).sort({ date: 1 })
        
        return res.status(200).json({
            status: true,
            message: "All successful visits fetched successfully",
            data: successfulVisits
        });
    }

    catch (error) {
        next(error)
    }
}

export const getAllCancelledVisits = async (_, res, next) => {

    try {
        const cancelledVisits = await Visit.find({ status: "cancelled" }).sort({ date: 1 });

        return res.status(200).json({
            status: true,
            message: "All cancelled visits fetched successfully",
            data: cancelledVisits
        });
    }
    catch (error) {
        next(error)
    }
}

export const updateVisitStaff = async (req, res, next) => {
    const { id } = req.params
    const { staffId } = req.body

    try {
        await Visit.findByIdAndUpdate(id, { staff: staffId, status: "confirmed" })

        return res.status(200).json({
            status: true,
            message: "Visit staff updated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}