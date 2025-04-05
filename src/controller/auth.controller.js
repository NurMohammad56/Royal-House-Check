import { User } from "../model/user.model.js";
import { sendEmail } from "../utils/email.utils.js";


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

// Register user with 2-step verification
export const register = async (req, res, next) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        // Validation
        if (!email || !password || !fullname || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "All fields are required."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Password and confirm password do not match."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Email already exists."
            });
        }

        // Create user
        const user = new User({ fullname, email, password });
        const verificationCode = user.generateVerificationCode();
        await user.save();

        // Send verification email
        const message = `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: "Verify Your Account",
            message
        });

        return res.status(201).json({
            status: true,
            message: "Verification code sent to your email. Please verify to complete registration.",
            data: {
                email: user.email,
                fullname: user.fullname
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify registration code

