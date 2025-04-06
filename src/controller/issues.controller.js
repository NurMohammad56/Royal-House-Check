import { Visit } from "../model/visit.model.js"


export const getAllIssues = async (req, res, next) => {
    const { id } = req.params

    try {
        const { issues } = await Visit.findById(id).select("issues")

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
    const { id } = req.params
    const { issue, type, media, notes } = req.body

    try {
        await Visit.findByIdAndUpdate(id, { $push: { issues: { issue, type, media, notes } } })

        return res.status(200).json({
            status: true,
            message: "Issue added successfully"
        })
    }

    catch (error) {
        next(error)
    }
}