import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification, getAdminNotifications, markAdminNotificationAsRead, deleteAdminNotification } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  isClient , isAdmin} from "../middleware/role.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = express.Router();

// Client
router.get("/user", verifyJWT, isClient, updateUserActivity, getNotifications);
router.put("/user/:notificationId/read", verifyJWT,isClient,updateUserActivity, markNotificationAsRead);
router.delete("/delete/:notificationId", verifyJWT,isClient, updateUserActivity, deleteNotification);

// Admin
router.get("/admin", verifyJWT, isAdmin, getAdminNotifications);
router.put("/admin/:notificationId/read", verifyJWT, isAdmin, markAdminNotificationAsRead);
router.delete("/admin/delete/:notificationId", verifyJWT, isAdmin, deleteAdminNotification);

export default router;  