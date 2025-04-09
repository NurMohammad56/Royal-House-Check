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

//gets a specific visit
export const getVisits = async (client, status, res) => {

    const visits = await Visit.find({ client, status }).select("-createdAt -updatedAt -__v").sort({ date: 1 }).lean()

    return res.status(200).json({
        status: true,
        message: `${status} visits fetched successfully`,
        data: visits
    })
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