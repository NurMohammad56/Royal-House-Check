import express from "express";
import { getNotifications, markNotificationAsRead } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.put("/:notificationId/read", verifyJWT, markNotificationAsRead);

export default router;