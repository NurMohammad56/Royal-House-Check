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
    try {
        //code to refresh access token goes here
    }

    catch (error) {
        next(error);
    }
}
