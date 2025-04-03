import jwt from "jsonwebtoken";

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

        // Add user to req
        req.user = decodedToken;
        next();
    }

    catch (error) {
        next(error)
    }
};