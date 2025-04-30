import { User } from "../model/user.model.js";
import { Visit } from "../model/visit.model.js"
import { cloudinaryUploadImage, cloudinaryUploadVideo } from "../utils/cloudinary.utils.js";

export const addIssue = async (req, res, next) => {
    const { email, place, issue, type, notes, issueDate } = req.body;

    try {
        // Find the user by email to get their ID
        const user = await User.findOne({ email }).select('_id');
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found with the provided email"
            });
        }

        // Find the existing visit by client ID
        const existingVisit = await Visit.findOne({ client: user._id });
        if (!existingVisit) {
            return res.status(404).json({
                status: false,
                message: "No visit found for the provided email"
            });
        }

        const timestamp = Date.now();

        // Upload media to Cloudinary (if provided)
        const [cloudinaryImage, cloudinaryVideo] = await Promise.all([
            req.files?.image?.[0]?.path
                ? cloudinaryUploadImage(req.files.image[0].path, `email-${email}-image-${timestamp}`, "issues/images")
                : null,
            req.files?.video?.[0]?.path
                ? cloudinaryUploadVideo(req.files.video[0].path, `email-${email}-video-${timestamp}`, "issues/videos")
                : null
        ]);

        const media = [];
        if (cloudinaryImage?.secure_url) media.push({ type: "photo", url: cloudinaryImage.secure_url });
        if (cloudinaryVideo?.secure_url) media.push({ type: "video", url: cloudinaryVideo.secure_url });

        // Create a new Visit document with the SAME visitId
        const newVisit = await Visit.create({
            visitId: existingVisit.visitId, // Keep the same visitId
            client: existingVisit.client,
            staff: existingVisit.staff || null,
            address: existingVisit.address,
            date: existingVisit.date,
            status: existingVisit.status || "confirmed",
            cancellationReason: existingVisit.cancellationReason || "",
            type: existingVisit.type,
            notes: existingVisit.notes || "",
            issues: [{
                place,
                issue,
                issueDate: issueDate || new Date(),
                type: type || "warning",
                media,
                notes
            }],
            isPaid: existingVisit.isPaid || false,
            plan: existingVisit.plan,
            addsOnService: existingVisit.addsOnService
        });

        // Populate client and staff fields
        const populatedVisit = await Visit.findById(newVisit._id)
            .populate('client', 'fullname')
            .populate('staff', 'fullname')
            .lean();

        return res.status(201).json({
            status: true,
            message: "New visit with issue created successfully",
            data: populatedVisit
        });
    } catch (error) {
        next(error);
    }
};
// Get issue by visit ID
export const getAllIssues = async (req, res, next) => {
    const { visitId } = req.params;
    console.log(visitId);
    try {
        const visit = await Visit.findById(visitId)
            .populate('client', 'fullname')
            .populate('staff', 'fullname')
            .lean();
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
        });
    }
    catch (error) {
        next(error);
    }
};


// get all visits associated with issues
export const getAllVisitsWithIssues = async (req, res, next) => {
    try {
        const visits = await Visit.find({ "issues.0": { $exists: true } });
        if (!visits || visits.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No visits found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Visits fetched successfully",
            data: visits
        });
    }
    catch (error) {
        next(error);
    }
}

export const deleteVisit = async (req, res, next) => {
    const { visitId } = req.params;

    try {
        const visit = await Visit.findById(visitId)
        if (!visit) {
            return res.status(404).json({
                status: false,
                message: "Visit not found"
            });
        }

        await Visit.findByIdAndDelete(visitId);
        return res.status(200).json({
            status: true,
            message: "Visit deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};