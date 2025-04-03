import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
router.post("/refresh-accessToken", verifyJWT, refreshAccessToken)

export default router;