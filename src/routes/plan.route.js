import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    deletePlan,
    deactivatePlan
} from "../controller/plan.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";


const router = express.Router();

router.get("/", verifyJWT, isAdmin, getAllPlans);
router.post("/add-plan", verifyJWT, isAdmin, addPlan);
router.put("/update-plan/:id", verifyJWT, isAdmin, updatePlan);
router.put("/deactivate/:id", verifyJWT, isAdmin, deactivatePlan);
router.delete("/deactivate/:id", verifyJWT, isAdmin, deletePlan);

export default router;