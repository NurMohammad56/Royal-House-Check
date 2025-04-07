import express from "express";
import {createPayment, confirmPayment, getPaymentHistory } from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post("/create", verifyJWT,isClient, createPayment);
router.post("/confirm", verifyJWT,isClient, confirmPayment);


// Admin
router.get("/history", verifyJWT, isAdmin, getPaymentHistory);

export default router;