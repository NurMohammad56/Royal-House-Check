import { User } from "../model/user.model.js";


// Generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return { accessToken, refreshToken };
    } catch (error) {
        return {
            status: false,
            message: error.message,
        };
    }
};
// Resister user
export const register = async (req, res, next) => {

    try {
        const { fullname, email, password } = req.body;

        if (!email || !password || !fullname) {
            return res.status(400).json({ status: false, message: "All fields are required." })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already exists." });
        }

        const user = new User({ fullname, email, password });
        await user.save();

        return res.status(201).json({ status: true, message: "User registered successfully.", data: user });
    }

    catch (error) {
        next(error);
    }
}

// Login user
export const login = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;
        if (!email || !password || !fullname) {
            return res.status(400).json({
                status: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });


        if (!user || !(await user.isPasswordValid(password))) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password."
            });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        res.setHeader("Authorization", `Bearer ${accessToken}`);


        return res.json({
            status: true,
            message: "Logged in successfully.",
            accessToken,
            refreshToken
        });
    }

    catch (error) {
        next(error);
    }
}

// logout user
export const logout = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res
                .status(400)
                .json({ status: false, message: "User not found." });
        }

        // Remove refreshToken from the database (user logout)
        await User.findByIdAndUpdate(user._id, { refreshToken: null });

        return res
            .status(200)
            .json({ status: true, message: "Logged out successfully" });
    }

    catch (error) {
        next(error);
    }
}

// Refresh access token
export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res
            .status(500)
            .json({ status: false, message: "Refresh token not provided." });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        return res
            .status(403)
            .json({ status: false, message: "Invalid refresh token." });
    }
    try {
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?.id);

        // check if user is not available then throw error
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Matching refreshToken with user refreshToken
        if (user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Refrsh token is expired or used");
        }

        // If the token is valid, generate a new access token and set the header
        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user.id);

        res.setHeader("Authorization", `Bearer ${accessToken}`);

        return res.status(200).json({
            status: true,
            message: "Access token refreshed successfully",
            accessToken,
            newRefreshToken,
        });
    }

    catch (error) {
        next(error);
    }
}
