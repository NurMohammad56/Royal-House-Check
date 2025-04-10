import express from "express";
import {
    totalActivePlansController,
    monthlyRevenueController,
    activeDiscountsController,
    totalUserController
} from "../controller/adminMatrics.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js"

const router = express.Router();

router.get("/active-plans", verifyJWT, isAdmin, totalActivePlansController);
router.get("/monthly-revenue", verifyJWT, isAdmin, monthlyRevenueController);
router.get("/active-discounts", verifyJWT, isAdmin, activeDiscountsController);
router.get("/total-user", verifyJWT, isAdmin, totalUserController);

export default router;
