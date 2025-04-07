import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = async (req, res, next) => {

    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                status: false,
                message: "Authorization header missing or invalid.",
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?.id).select("-password");

        // Add user to req
        req.user = user;
        next();
    }

    catch (error) {
        next(error)
    }
};