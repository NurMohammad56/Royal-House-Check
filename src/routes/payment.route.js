import express from "express";
import {createPayment, confirmPayment, getPaymentHistory } from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post("/create", verifyJWT, createPayment);
router.put("/confirm", verifyJWT, confirmPayment);


// Admin
router.get("/history", verifyJWT, isAdmin, getPaymentHistory);

export default router;