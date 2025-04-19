import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    getAPlan,
    deactivatePlan,
    activatePlan
} from "../controller/plan.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/add-plan", verifyJWT, isClient, addPlan);
router.get("/get-all-plans", verifyJWT, isAdmin, getAllPlans);
router.get("/get-a-plan/:id", verifyJWT, isClient, getAPlan);
router.patch("/update-plan/:id", verifyJWT, isClient, updatePlan);
router.patch("/deactivate-plan/:id", verifyJWT, deactivatePlan);
router.patch("/activate-plan/:id", verifyJWT, activatePlan);

export default router;