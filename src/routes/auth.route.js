import { Router } from "express";
import { login, verifyLogin, logout, refreshAccessToken, register, verifyRegistration, forgetPassword,verifyOTP, resetPassword } from "../controller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/verify-registration", verifyRegistration);
router.post("/login", login);
router.post("/verify-login", verifyLogin);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-accessToken", verifyJWT, refreshAccessToken)
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;