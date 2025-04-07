import express from "express";
import {
    getAllPlans,
    addPlan,
    updatePlan,
    deletePlan,
} from "../controller/plan.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";
import {isAdmin} from "../middleware/role.middleware.js";


const router = express.Router();

router.get("/", verifyJWT, isAdmin, getAllPlans);
router.post("/", verifyJWT, isAdmin, addPlan);
router.put("/:id", verifyJWT, isAdmin, updatePlan);
router.delete("/:id", verifyJWT, isAdmin, deletePlan);

export default router;