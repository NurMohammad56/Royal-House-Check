import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    getAPlan,
    deletePlan
} from "../controller/plan.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/add-plan", verifyJWT, addPlan);
router.get("/get-all-plans", verifyJWT, isAdmin, getAllPlans);
router.get("/get-a-plan/:id", verifyJWT, isClient, getAPlan);
router.patch("/update-plan/:id", verifyJWT, isAdmin, updatePlan);
router.delete("/delete-plan/:id", verifyJWT, deletePlan);
router.get("/get-all-plans", verifyJWT, getAllPlans);
router.get("/get-a-plan/:id", verifyJWT, getAPlan);
router.patch("/update-plan/:id", verifyJWT, updatePlan);
router.patch("/delete-plan/:id", verifyJWT, deletePlan);


export default router;