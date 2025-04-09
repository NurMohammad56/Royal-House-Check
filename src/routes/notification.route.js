import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification, getAdminNotifications, markAdminNotificationAsRead, deleteAdminNotification } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  isClient , isAdmin} from "../middleware/role.middleware.js";

const router = express.Router();

// Client
router.get("/", verifyJWT, isClient, getNotifications);
router.put("/:notificationId/read", verifyJWT,isClient, markNotificationAsRead);
router.delete("/delete/:notificationId", verifyJWT,isClient, deleteNotification);

// Admin
router.get("/admin", verifyJWT, isAdmin, getAdminNotifications);
router.put("/admin/:notificationId/read", verifyJWT, isAdmin, markAdminNotificationAsRead);
router.delete("/admin/delete/:notificationId", verifyJWT, isAdmin, deleteAdminNotification);

export default router;  