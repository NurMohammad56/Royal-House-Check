import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    deletePlan,
    addAddsOnService
} from "../controller/plan.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/add-plan", verifyJWT, isClient, addPlan);
router.get("/", verifyJWT, isAdmin, getAllPlans);
router.put("/update-plan/:id", verifyJWT, isClient, updatePlan);
router.put("/update-add-addsOnService/:id", verifyJWT, isClient, addAddsOnService);
router.delete("/delete-plan/:id", verifyJWT, isClient, deletePlan);

export default router;