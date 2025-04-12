import express from "express";
import {
    totalActivePlansController,
    monthlyRevenueController,
    activeDiscountsController,
    totalUserController,
    totalAdminController,
    totalStaffController,
    getActiveUsersController,
    getRevenueGrowthController,
    getRecentUserActivityController,
    getInActiveUsersController
} from "../controller/adminMatrics.controller.js";
import {getAllUsers, getUserByRole, getUserByStatus, addUser, updateUser, deleteUser} from '../controller/manageUser.controller.js'

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js"

const router = express.Router();

// Metrics
router.get("/metrics/active-plans", verifyJWT, isAdmin, totalActivePlansController);
router.get("/metrics/monthly-revenue", verifyJWT, isAdmin, monthlyRevenueController);
router.get("/metrics/active-discounts", verifyJWT, isAdmin, activeDiscountsController);
router.get("/metrics/total-client", verifyJWT, isAdmin, totalUserController);
router.get("/metrics/total-admin", verifyJWT, isAdmin, totalAdminController);
router.get("/metrics/total-staff", verifyJWT, isAdmin, totalStaffController);
router.get("/metrics/active-users", verifyJWT, isAdmin, getActiveUsersController);
router.get("/metrics/inactive-users", verifyJWT, isAdmin, getInActiveUsersController);
router.get("/metrics/revenue-growth", verifyJWT, isAdmin, getRevenueGrowthController);
router.get("/metrics/recent-user-activity/:userId", verifyJWT, isAdmin, getRecentUserActivityController);

// User managements
router.get("/all-user", verifyJWT, isAdmin, getAllUsers);
router.get("/user-by-role/:role", verifyJWT, isAdmin, getUserByRole);
router.get("/user-by-status/:status", verifyJWT, isAdmin, getUserByStatus);
router.post("/add-user", verifyJWT, isAdmin, addUser)
router.put("/update-user/:id", verifyJWT, isAdmin, updateUser);
router.delete("/delete-user/:id", verifyJWT, isAdmin, deleteUser);



export default router;
