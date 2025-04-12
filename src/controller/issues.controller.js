import { Visit } from "../model/visit.model.js"
import { cloudinaryUpload } from "../utils/cloudinary.utils.js";

export const getAllIssues = async (req, res, next) => {
    const { visitId } = req.params

    try {
        const { issues } = await Visit.findById(visitId).select("issues")

        if (!issues) {
            return res.status(404).json({
                status: false,
                message: "No issues found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Issues fetched successfully",
            data: issues
        })
    }

    catch (error) {
        next(error)
    }
}

export const addIssue = async (req, res, next) => {
    const { visitId } = req.params
    const { place, issue, type, notes } = req.body

    try {
        const timestamp = Date.now();

        //creating image url
        const cloudinaryUploadImage = await cloudinaryUpload(req.files?.image[0].path, `visit-${visitId}-image-${timestamp}`, "issues/images");

        //creating video url
        const cloudinaryUploadVideo = await cloudinaryUpload(req.files?.video[0].path, `visit-${visitId}-video-${timestamp}`, "issues/videos");

        const imageUrl = cloudinaryUploadImage?.secure_url
        const videoUrl = cloudinaryUploadVideo?.secure_url

        const media = [{
            type: "photo",
            url: imageUrl
        }, {
            type: "video",
            url: videoUrl
        }]

        await Visit.findByIdAndUpdate(visitId, { $push: { issues: { place, issue, type, media, notes } } }).lean()

        return res.status(200).json({
            status: true,
            message: "Issue added successfully"
        })
    }

    catch (error) {
        next(error)
    }
}