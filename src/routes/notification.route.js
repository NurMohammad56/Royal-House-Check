import express from "express";
import { getNotifications, markNotificationAsRead } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  isClient } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, isClient, getNotifications);
router.put("/:notificationId/read", verifyJWT,isClient, markNotificationAsRead);

export default router;