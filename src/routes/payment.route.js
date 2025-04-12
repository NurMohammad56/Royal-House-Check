import express from "express";
import {
    createVisitPayment,
    confirmPayment,
    refundPayment,
    getUserPayments,
    getPaymentDetails,
    getPaymentById,
    downloadPaymentPdf
} from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isAdmin, isClient} from "../middleware/role.middleware.js"

const router = express.Router();

// User
router.post("/visit-payment", verifyJWT, isClient, createVisitPayment);
router.post("/confirm/:paymentId", verifyJWT, isClient, confirmPayment);
router.post("/refund/:paymentId", verifyJWT, isClient, refundPayment);
router.get("/user/:userId", verifyJWT, isClient, getUserPayments);

// Admin
router.get("/details/:paymentId", verifyJWT, isAdmin, getPaymentDetails);
router.get("/:paymentId", verifyJWT,isAdmin, getPaymentById);
router.get("/download/:paymentId", verifyJWT,isAdmin, downloadPaymentPdf);

export default router;
