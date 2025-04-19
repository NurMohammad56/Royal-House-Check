import express from "express";
import {
    createVisitPayment,
    confirmPayment,
    refundPayment,
    getUserPayments,
    getPaymentDetails,
    getPaymentById,
    createMonthlyOrWeeklyPayment,
} from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js"

const router = express.Router();

// User
router.post("/visit-payment", verifyJWT, isClient, createVisitPayment);
router.post("/monthlyOrWeekly-payment", verifyJWT, isClient, createMonthlyOrWeeklyPayment);
router.post("/confirm/:paymentId", verifyJWT, isClient, confirmPayment);
router.post("/refund/:paymentId", verifyJWT, isClient, refundPayment);
router.get("/paymentDetails/:userId", verifyJWT, isClient, getUserPayments);


// Admin
router.get("/paymentDetails-admin/:paymentId", verifyJWT, isAdmin, getPaymentDetails);
router.get("/:paymentId", verifyJWT, isAdmin, getPaymentById);

export default router;
