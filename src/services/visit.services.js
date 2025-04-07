import { Visit } from "../model/visit.model.js";
import { generateCode } from "../utils/generateCode.js";


export const createCode = async (next) => {

    try {
        let code;
        let visit

        do {
            code = generateCode();

            visit = await Visit.findOne({ visitCode: code });
        } while (visit)

        return code;
    }

    catch (error) {
        next(error)
    }
}

//gets a specific visit
export const getVisits = async (client, status, res, next) => {

    try {
        const visits = await Visit.find({ client, status }).select("-createdAt -updatedAt -__v -_id").sort({ date: 1 })

        return res.status(200).json({
            status: true,
            message: `${status} visits fetched successfully`,
            data: visits
        })
    }

    catch (error) {
        next(error)
    }
}