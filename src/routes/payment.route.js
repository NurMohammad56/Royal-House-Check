import express from "express";
import {createPayment, confirmPayment, getPaymentHistory, deactivateSubscription } from "../controller/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post("/create", verifyJWT,isClient, createPayment);
router.put("/confirm/:paymentId", verifyJWT,isClient, confirmPayment);


// Admin
router.get("/history", verifyJWT, isAdmin, getPaymentHistory);
router.put("/:paymentId/deactivate", verifyJWT, isAdmin, deactivateSubscription);

export default router;