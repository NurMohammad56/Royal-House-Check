import express from "express";
import {
    getAdminMetricsAndRevenueController,
    getRevenueGrowthController,
    getRecentUserActivityController,
} from "../controller/adminMatrics.controller.js";
import { getAllUsers, addUser, updateUser, deleteUser, getAllStaff, getUserByRoleStatus } from '../controller/manageUser.controller.js'

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js"

const router = express.Router();

// Metrics
router.get('/metrics', getAdminMetricsAndRevenueController);
router.get("/metrics/revenue-growth", verifyJWT, isAdmin, getRevenueGrowthController);
router.get("/metrics/recent-user-activity", verifyJWT, isAdmin, getRecentUserActivityController);

// User managements
router.get("/all-user", verifyJWT, isAdmin, getAllUsers);
router.get("/user-by-role-status/:role/:status", verifyJWT, isAdmin, getUserByRoleStatus);
router.get("/all-staff", verifyJWT, isAdmin, getAllStaff);
router.post("/add-user", verifyJWT, isAdmin, addUser)
router.put("/update-user/:id", verifyJWT, isAdmin, updateUser);
router.delete("/delete-user/:id", verifyJWT, isAdmin, deleteUser);


export default router;
