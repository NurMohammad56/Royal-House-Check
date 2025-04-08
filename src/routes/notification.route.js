import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  isClient } from "../middleware/role.middleware.js";

const router = express.Router();

// Client
router.get("/", verifyJWT, isClient, getNotifications);
router.put("/:notificationId/read", verifyJWT,isClient, markNotificationAsRead);
router.delete("/delete/:notificationId", verifyJWT,isClient, deleteNotification);

export default router;