import { Router } from "express";
import { getVisitById, updateVisitStatus } from "../controller/visits.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/get-visit/:id', verifyJWT, getVisitById)
router.patch('/update-visit-status/:id', verifyJWT, updateVisitStatus);

export default router;