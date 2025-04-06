import { Router } from "express";
import { getAllVisitsCount, getPendingVisitsCount } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/get-all-visits-count', verifyJWT, getAllVisitsCount);
router.get('/get-pending-visits-count', verifyJWT, getPendingVisitsCount);

export default router;