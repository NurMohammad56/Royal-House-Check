import express from "express";
import { getPaymentHistory } from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/history", verifyJWT, isAdmin, getPaymentHistory);

export default router;