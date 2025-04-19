import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    deletePlan,
    getAPlan
} from "../controller/plan.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/add-plan", verifyJWT, isClient, addPlan);
router.get("/get-all-plans", verifyJWT, isAdmin, getAllPlans);
router.get("/get-a-plan/:id", verifyJWT, isClient, getAPlan);
router.patch("/update-plan/:id", verifyJWT, isClient, updatePlan);
router.delete("/delete-plan/:id", verifyJWT, isClient, deletePlan);

export default router;