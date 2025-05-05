import { User } from "../model/user.model.js";
import { sendEmail } from "../utils/email.utils.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Password and confirm password do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already exists.",
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
      message,
    });

    return res.status(201).json({
      status: true,
      message:
        "Verification code sent to your email. Please verify to complete registration.",
      data: {
        email: user.email,
        fullname: user.fullname,
      },
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
        message: "Verification code is required.",
      });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    const user = await User.findOne({ verificationCode: hashedCode });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "User is already verified.",
      });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        status: false,
        message: "Verification code has expired.",
      });
    }

    (user.status = "active"),
      (user.lastActive = Date.now()),
      (user.sessions = [{ sessionStartTime: Date.now() }]);
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Account verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification code
export const resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "User is already verified.",
      });
    }

    // Generate and hash new verification code
    const verificationCode = user.generateVerificationCode();
    const hashedCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    user.verificationCode = hashedCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: "Verify Your Account",
      message,
    });

    return res.status(200).json({
      status: true,
      message:
        "Verification code sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("first");

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordValid(password))) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: false,
        message: "Please verify your account first.",
      });
    }

    // Update session on login
    const now = Date.now();
    user.sessions.push({
      sessionStartTime: now,
      sessionEndTime: null,
    });

    user.lastActive = now;
    user.status = "active";
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Set accessToken in header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({
      status: true,
      message: "Logged in successfully.",
      data: {
        refreshToken,
        user,
      },
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: false,
        message: "Refresh token is required.",
      });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Invalid refresh token.",
      });
    }

    const now = Date.now();
    // Close any open session
    const openSession = user.sessions.find((s) => !s.sessionEndTime);
    if (openSession) {
      openSession.sessionEndTime = now;
    }

    user.status = "inactive";
    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Logged out successfully.",
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
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    const resetCode = user.generateVerificationCode();
    await user.save({ validateBeforeSave: false });

    // Send reset code email
    const message = `
            You are receiving this email because you requested a password reset for your account.
            Your password reset code is: ${resetCode}
            This code will expire in 15 minutes.
            If you did not request this, please ignore this email.
        `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Code",
        message,
      });

      return res.status(200).json({
        status: true,
        message: "Password reset code sent to your email.",
      });
    } catch (emailError) {
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: false,
        message:
          "There was an error sending the email. Please try again later.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: false,
        message: "Verification code is required.",
      });
    }

    const user = await User.findOne({
      verificationCode: crypto.createHash("sha256").update(code).digest("hex"),
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        status: false,
        message: "Verification code has expired.",
      });
    }

    // Clear verification code
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Verification code is valid.",
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    const existedUser = req.user;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne(existedUser);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Reset password
    user.password = password;
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
        message,
      });

      return res.status(200).json({
        status: true,
        message: "Password reset successfully.",
      });
    } catch (emailError) {
      return res.status(500).json({
        status: false,
        message:
          "Password reset was successful, but we couldn't send the confirmation email.",
      });
    }
  } catch (error) {
    next(error);
  }
};

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
  } catch (error) {
    next(error);
  }
};
