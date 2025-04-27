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

export const createVisitService = async (visitData, clientId) => {
    if (!visitData.status) {
        throw new Error("Status is required");
    }

    const visit = new Visit({
        ...visitData,
        client: clientId,
    });

    return await visit.save();
};
//  get all visits by both
export const getAllVisitsService = async (page, limit, status, res) => {
    try {
        const query = {};

        if (status) {
            query.status = status;
        }

        const total = await Visit.countDocuments(query);

        const visits = await Visit.find(query)
            .populate("client staff")
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return res.status(200).json({
            status: true,
            message: "All visits fetched successfully",
            data: visits,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        throw new Error("Error fetching visits: " + error.message);
    }
};

//get visits by status
export const getVisits = async (client, status, res) => {

    const visits = await Visit.find({ client, status }).populate({path: "client staff", select:"fullname email"}).sort({ date: 1 }).lean()

    return res.status(200).json({
        status: true,
        message: `${status} visits fetched successfully`,
        data: visits
    })
}

export const getVisitsPagination = async (page, limit, client, status, res) => {

    const visits = await Visit.find({
        client,
        status
    })
        .populate("client staff")
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean()

    const total = await Visit.countDocuments({
        client,
        status
    });

    return res.status(200).json({
        status: true,
        data: visits,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: Number(limit)
        }
    })
}

export const getCompletedVisitsWithIssuesService = async (page, limit, client, res) => {

    const query = {
        client,
        status: "completed",
        issues: { $ne: [] } // only visits where issues array is not empty
    };

    const visits = await Visit.find(query)
        .populate("client staff")
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean()

    const total = await Visit.countDocuments(query);

    return res.status(200).json({
        status: true,
        data: visits,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: Number(limit)
        }
    })
}

//get visits by type
export const getVisitsByTypeService = async (page, limit, client, type, res) => {

    let query

    if (client) {
        query = { client, type }
    }

    else {
        query = { type }
    }

    const visits = await Visit.find(query)
        .populate("client staff")
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean()

    const total = await Visit.countDocuments(query);

    return res.status(200).json({
        status: true,
        message: `${type} visits fetched successfully`,
        data: visits,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: Number(limit)
        }
    })
}

export const getPastVisitsService = async (page, limit, client, res) => {
    const query = {
        client,
        status: "completed"
    };

    const visits = await Visit.find(query)
        .populate({path: "client staff", select: "fullname email"})
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

    const total = await Visit.countDocuments(query);

    return res.status(200).json({
        status: true,
        message: "Past visits fetched successfully",
        data: visits,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: Number(limit)
        }
    });
};

export const getUpcomingVisitsService = async (page, limit, res) => {

    const visits = await Visit.find({
        status: { $in: "pending"}
    })
        .populate({path: "client", select: "-sessions -refreshToken"})
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Visit.countDocuments({
        status: { $in: "pending"}
    });

    return res.status(200).json({
        status: true,
        message: "Upcoming visits fetched successfully",
        data: visits,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: Number(limit)
        }
    });
}

export const updateVisitService = async (body, id) => {
    

    // Validate visit ID
    const visit = mongoose.Types.ObjectId.isValid(id) && await Visit.findById(id).select("status");

    if (!visit) {
        throw new Error("Visit not found");
    }

    // Check if visit is already completed or cancelled
    if (visit.status === "completed" || visit.status === "cancelled") {
        throw new Error("You cannot update a visit that is completed or cancelled");
    }

    // Check for duplicate visits
    const existingVisit = await Visit.findOne({
        date: visit.date,
        client: visit.client,
        status: { $in: ["pending", "confirmed"] },
    });

    if (existingVisit && existingVisit._id.toString() !== id) {
        throw new Error("You already have a visit on this date");
    }

    const updatedVisit = await Visit.findByIdAndUpdate(id, body, { new: true })
        .select("-createdAt -updatedAt -__v")
        .populate({path: "client staff", select: "-sessions -refreshToken"});

    return updatedVisit;
};


