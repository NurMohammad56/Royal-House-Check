import express from "express";
import {createPayment, confirmPayment, getUserPaymentHistory, deactivateSubscription, getPaymentHistory, downloadPaymentPdf } from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post("/create", verifyJWT,isClient, createPayment);
router.get("/confirm/:paymentId", verifyJWT,isClient, confirmPayment);


// Admin
router.get("/history-admin", verifyJWT, isAdmin, getPaymentHistory);
router.put("/:paymentId/deactivate", verifyJWT, isAdmin, deactivateSubscription);

// User
router.get("/history-user/:userId", verifyJWT, isClient, getUserPaymentHistory);
router.get("/downloadPDF/:paymentId", verifyJWT, isClient, downloadPaymentPdf);

export default router;