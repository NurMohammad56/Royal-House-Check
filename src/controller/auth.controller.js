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
export const verifyRegistration = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                status: false,
                message: "Verification code is required."
            });
        }

        const user = await User.findOne({ verificationCode: crypto.createHash("sha256").update(code).digest("hex") });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Invalid or expired verification code."
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                status: false,
                message: "User is already verified."
            });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({
                status: false,
                message: "Verification code has expired."
            });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Account verified successfully."
        });
    } catch (error) {
        next(error);
    }
};

// Login with 2-step verification
export const login = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "All information are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.isPasswordValid(password))) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password."
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                status: false,
                message: "Please verify your account first."
            });
        }

        // Generate and send verification code
        const verificationCode = user.generateVerificationCode();
        await user.save();

        // Send verification email
        const message = `Your login verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: "Login Verification Code",
            message
        });

        return res.status(200).json({
            status: true,
            message: "Verification code sent to your email. Please verify to login.",
            data: {
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify login code
export const verifyLogin = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                status: false,
                message: "Verification code is required."
            });
        }

        const user = await User.findOne({ verificationCode: crypto.createHash("sha256").update(code).digest("hex") });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Invalid or expired verification code."
            });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({
                status: false,
                message: "Verification code has expired."
            });
        }

        // Clear verification code
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // Set accessToken in header
        res.setHeader("Authorization", `Bearer ${accessToken}`);

        return res.status(200).json({
            status: true,
            message: "Logged in successfully.",
            data: {
                refreshToken,
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Forget password
export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found."
            });
        }

        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send reset email
        const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
        const message = `
            You are receiving this email because you (or someone else) requested a password reset for your account.
            Please click the link below to reset your password:
            ${resetUrl}
            If you did not request this, please ignore this email. This link will expire in 15 minutes.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message
            });

            return res.status(200).json({
                status: true,
                message: "Password reset link sent to your email."
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                status: false,
                message: "There was an error sending the email. Please try again later."
            });
        }
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Password and confirm password are required."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Passwords do not match."
            });
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized access."
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        const message = `
            Your password has been successfully changed.
            If you did not request this change, please contact us immediately.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Changed Successfully",
                message
            });

            return res.status(200).json({
                status: true,
                message: "Password reset successfully."
            });
        } catch (emailError) {
            return res.status(500).json({
                status: false,
                message: "Password reset was successful, but we couldn't send the confirmation email."
            });
        }
    } catch (error) {
        next(error);
    }
};

// // Logout user
// export const logout = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.body;

//         if (!refreshToken) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Refresh token is required."
//             });
//         }

//         const user = await User.findOne({ refreshToken });
//         if (!user) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Invalid refresh token."
//             });
//         }

//         // Invalidate the refresh token
//         user.refreshToken = undefined;
//         await user.save();

//         return res.status(200).json({
//             status: true,
//             message: "Logged out successfully."
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const refreshAccessToken = async (req, res, next) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res
//             .status(500)
//             .json({ status: false, message: "Refresh token not provided." });
//     }

//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//         return res
//             .status(403)
//             .json({ status: false, message: "Invalid refresh token." });
//     }
//     try {
//         const decodedToken = jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         );

//         const user = await User.findById(decodedToken?.id);

//         // check if user is not available then throw error
//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token");
//         }

//         // Matching refreshToken with user refreshToken
//         if (user.refreshToken !== refreshToken) {
//             throw new ApiError(401, "Refrsh token is expired or used");
//         }

//         // If the token is valid, generate a new access token and set the header
//         const { accessToken, refreshToken: newRefreshToken } =
//             await generateAccessAndRefreshToken(user.id);

//         res.setHeader("Authorization", `Bearer ${accessToken}`);

//         return res.status(200).json({
//             status: true,
//             message: "Access token refreshed successfully",
//             accessToken,
//             newRefreshToken,
//         });
//     }

//     catch (error) {
//         next(error);
//     }
// }
