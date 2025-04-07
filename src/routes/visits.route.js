import { Router } from "express";
import { updateVisitStatus } from "../controller/visits.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.patch('/update-visit-status/:id', verifyJWT, updateVisitStatus);

export default router;