import express from "express";
import {
    totalActivePlansController,
    monthlyRevenueController,
    activeDiscountsController,
    totalUserController,
    totalAdminController,
    totalStaffController,
    getActiveUsersController,
} from "../controller/adminMatrics.controller.js";
import {getAllUsers, addUser, updateUser} from '../controller/manageUser.controller.js'

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js"

const router = express.Router();

// Metrics
router.get("/metrics/active-plans", verifyJWT, isAdmin, totalActivePlansController);
router.get("/metrics/monthly-revenue", verifyJWT, isAdmin, monthlyRevenueController);
router.get("/metrics/active-discounts", verifyJWT, isAdmin, activeDiscountsController);
router.get("/metrics/total-user", verifyJWT, isAdmin, totalUserController);
router.get("/metrics/total-admin", verifyJWT, isAdmin, totalAdminController);
router.get("/metrics/total-staff", verifyJWT, isAdmin, totalStaffController);
router.get("/metrics/active-users", verifyJWT, isAdmin, getActiveUsersController);

// User managements
router.get("/all-user", verifyJWT, isAdmin, getAllUsers);
router.post("/add-user", verifyJWT, isAdmin, addUser)
router.put("/update-user/:id", verifyJWT, isAdmin, updateUser);


export default router;
