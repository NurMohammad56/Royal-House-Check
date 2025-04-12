import express from "express";
import { webhookController } from "../controller/webhook.controller.js";

const router = express.Router();

router.post("/stripe", 
    express.raw({ type: "application/json" }), 
    webhookController.handleStripeWebhook
);

export default router;