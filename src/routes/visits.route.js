import { Router } from "express";
import { getVisitById, updateVisitStatus } from "../controller/visits.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.get('/get-visit/:id', verifyJWT, updateUserActivity, getVisitById)
router.patch('/update-visit-status/:id', verifyJWT, updateUserActivity, updateVisitStatus);

export default router;