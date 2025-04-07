import express from "express";
import { stripeWebhook, paypalWebhook } from "../controller/webhook.controller.js";

const router = express.Router();

router.post("/stripe",express.raw({ type: "application/json" }), stripeWebhook);
router.post("/paypal", express.raw({ type: "application/json" }), paypalWebhook);

export default router;