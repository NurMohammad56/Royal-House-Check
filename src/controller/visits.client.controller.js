import { Payment } from "../model/payment.model.js"
import { Visit } from "../model/visit.model.js"
import { createVisitService, getAllVisitsService, getCompletedVisitsWithIssuesService, getPastVisitsService, getUpcomingVisitsService, getVisits, getVisitsPagination, updateVisitService } from "../services/visit.services.js"

export const createVisit = async (req, res, next) => {

    const { address, date } = req.body
    const client = req.user._id

    try {
        if (!address || !date) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields"
            })
        }

        const isPaid = await Payment.findOne({ user: client }).select("status")

        const visitData = await createVisitService({ address, date, isPaid: isPaid?.status == "completed" ? true : false, status: "pending" }, client, res)

        return res.status(201).json({
            status: true,
            message: "Visit created successfully",
            data: visitData
        })
    }

    catch (error) {
        next(error)
    }
}

export const getAllVisits = async (req, res, next) => {

    const client = req.user._id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getAllVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getAllVisitForSpecificClient = async (req, res, next) => {
    const client = req.user._id;
    const search = req.query.search?.trim().toLowerCase() || "";
    const status = req.query.status?.trim().toLowerCase() || null;
    const type = req.query.type?.trim().toLowerCase() || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!client) {
        return res.status(400).json({ success: false, message: "clientId is required" });
    }

    try {
        const filterQuery = { client };

        if (status) filterQuery.status = new RegExp(`^${status}$`, 'i');
        if (type) filterQuery.type = new RegExp(`^${type}$`, 'i');

        const visits = await Visit.find(filterQuery)
            .populate("client staff plan addsOnService");

        const filtered = visits.filter(v => {
            const clientName = v.client?.fullname?.toLowerCase() || "";
            const staffName = v.staff?.fullname?.toLowerCase() || "";
            const visitType = v.type?.toLowerCase() || "";
            const visitStatus = v.status?.toLowerCase() || "";
            const visitCode = v.visitCode?.toLowerCase() || "";

            const matchesSearch = search
                ? clientName.includes(search) ||
                staffName.includes(search) ||
                visitType.includes(search) ||
                visitStatus.includes(search) ||
                visitCode.includes(search)
                : true;

            return matchesSearch;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedVisits = filtered.slice(skip, skip + limit);

        const meta = {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
        };

        return res.status(200).json({
            success: true,
            data: paginatedVisits,
            meta
        });

    } catch (error) {
        next(error);
    }
};

export const getConfirmedVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "confirmed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getPendingVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "pending", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisitsPagination = async (req, res, next) => {

    const client = req.user._id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getVisitsPagination(page, limit, client, "completed", res)
    }

    catch (error) {
        next(error)
    }
}

export const getCompletedVisitsWithIssues = async (req, res, next) => {

    const client = req.user._id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getCompletedVisitsWithIssuesService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getCancelledVisits = async (req, res, next) => {

    const client = req.user._id
    try {
        await getVisits(client, "cancelled", res)
    }

    catch (error) {
        next(error)
    }
}

export const getPastVisits = async (req, res, next) => {
    const client = req.user._id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getPastVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getUpcomingVisits = async (req, res, next) => {
    const client = req.user._id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    try {
        await getUpcomingVisitsService(page, limit, client, res)
    }

    catch (error) {
        next(error)
    }
}

export const getNextVisit = async (req, res, next) => {
    const client = req.user._id

    try {
        const visit =
            (await Visit.findOne({ client, date: { $gte: new Date() } })
                .populate("client staff")
                .sort({ date: 1 })
                .select("-createdAt -updatedAt -__v")
                .lean())

        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "No upcoming visits found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Next visit fetched successfully",
            data: visit
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateVisit = async (req, res, next) => {
    const { id } = req.params
    const { address, date } = req.body
    const client = req.user._id

    try {
        const updatedVisit = await updateVisitService({ address, date }, id, client, res).populate({ path: "client staff", select: "-sessions -refreshToken" }).lean()

        return res.status(200).json({
            status: true,
            message: "Visit updated successfully",
            data: updatedVisit
        })
    }

    catch (error) {
        next(error)
    }
}

// All issues count
export const getAllIssuesCount = async (req, res, next) => {
    const client = req.user._id;

    try {
        const visits = await Visit.find({ client }).populate("issues").lean();

        if (!visits || visits.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No visits found"
            });
        }

        const issuesCount = visits.reduce((count, visit) => {
            return count + (visit.issues && visit.issues.length > 0 ? 1 : 0);
        }, 0);

        return res.status(200).json({
            status: true,
            message: "Issues count fetched successfully",
            data: { issuesCount }
        });
    } catch (error) {
        next(error);
    }
};