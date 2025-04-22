import mongoose from "mongoose";
import { Visit } from "../model/visit.model.js";
import { generateCode } from "../utils/generateCode.js";

export const createCode = async () => {

    let code;
    let visit

    do {
        code = generateCode();

        visit = await Visit.findOne({ visitCode: code }).lean()
    } while (visit)

    return code;
}

export const createVisitService = async (body, client, res) => {

    const { date } = body

    if (!body.client) {
        body.client = client
    }

    if (new Date(date).getTime() < new Date().getTime()) {
        return res.status(400).json({
            status: false,
            message: "Visit date must be in the future"
        })
    }

    const visit = await Visit.findOne({ client, date }).lean()

    if (visit) {
        return res.status(400).json({
            status: false,
            message: "A visit with the same date already exists"
        })
    }

    const code = await createCode()

    await Visit.create({ visitCode: code, ...body })

    return
}

//get visits by status
export const getVisits = async (client, status, res) => {

    const visits = await Visit.find({ client, status }).populate("client").sort({ date: 1 }).lean()

    return res.status(200).json({
        status: true,
        message: `${status} visits fetched successfully`,
        data: visits
    })
}

//get visits by type
export const getVisitsByType = async (client, type, res) => {

    const visits = await Visit.find({ client, type }).populate("client").sort({ date: 1 }).lean()

    return res.status(200).json({
        status: true,
        message: `${type} visits fetched successfully`,
        data: visits
    })
}

export const getPastVisitsService = async (page, limit, client, res) => {

    const visits = await Visit.find({
        client,
        date: { $lt: new Date() }
    })
        .populate("client")
        .sort({ date: -1 }) // most recent first
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Visit.countDocuments({
        client,
        date: { $lt: new Date() }
    });

    return res.status(200).json({
        status: true,
        message: "Past visits fetched successfully",
        data: visits,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page)
    });
}

export const getUpcomingVisitsService = async (page, limit, client, res) => {

    const visits = await Visit.find({
        client,
        date: { $gte: new Date() }
    })
        .populate("client")
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Visit.countDocuments({
        client,
        date: { $gte: new Date() }
    });

    return res.status(200).json({
        status: true,
        message: "Upcoming visits fetched successfully",
        data: visits,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page)
    });
}

export const updateVisitService = async (body, id, client, res) => {

    const { date } = body

    //checking if the provided date is in the future
    if (new Date(date).getTime() < new Date().getTime()) {
        return res.status(400).json({
            status: false,
            message: "Visit date must be in the future"
        })
    }

    const visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findById(id).select("status").lean()

    //checking if the visit id is valid or not
    if (!visit) {
        return res.status(404).json({
            status: false,
            message: "Visit not found"
        });
    }

    //checking if the visit is completed or cancelled
    if (visit.status === "completed" || visit.status === "cancelled") {
        return res.status(403).json({
            status: false,
            message: "You cannot update the visit which is completed or cancelled"
        })
    }

    const existingVisit = await Visit.findOne({
        date,
        client,
        status: { $in: ["pending", "confirmed"] }
    }).lean()

    // checking if the visit date is already taken by another visit
    if (existingVisit && existingVisit._id.toString() !== id) {
        return res.status(400).json({
            status: false,
            message: "You already taken a visit in this date"
        });
    }

    const updatedVisit = await Visit.findByIdAndUpdate(id, body, { new: true }).select("-createdAt -updatedAt -__v").lean()

    return updatedVisit
}