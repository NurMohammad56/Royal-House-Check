import { Router } from "express";
import {
    getAllActivePlans,
    getActivePlanById,
    createActivePlan,
    addActivePlanOfUser,
    deleteActivePlanOfUser,
    createAddsOnServicePlan,
    addActiveServiceOfUser,
    deleteActiveServiceOfUser
} from "../controller/activePlans.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/get-all-active-plans", verifyJWT, getAllActivePlans);
router.get("/get-active-plan/:id", verifyJWT, getActivePlanById);
router.post("/create-active-plan", verifyJWT, createActivePlan);
router.post("/add-active-plan-of-user/:userId", verifyJWT, addActivePlanOfUser);
router.delete("/delete-active-plan-of-user/:userId", verifyJWT, deleteActivePlanOfUser);
router.post("/create-adds-on-service-plan", verifyJWT, createAddsOnServicePlan);
router.post("/add-active-service-of-user/:userId", verifyJWT, addActiveServiceOfUser);
router.delete("/delete-active-service-of-user/:userId", verifyJWT, deleteActiveServiceOfUser);

export default router;