import { Router } from "express";
import { getAllCancelledVisits, getAllSuccessfulVisits, getAllUpcomingVisits, getAllVisitsCount, getPendingVisitsCount, updateVisitStaff } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/get-all-visits-count', verifyJWT, getAllVisitsCount);
router.get('/get-pending-visits-count', verifyJWT, getPendingVisitsCount)
router.get('/get-all-upcoming-visits', verifyJWT, getAllUpcomingVisits);
router.get('/get-all-successful-visits', verifyJWT, getAllSuccessfulVisits);
router.get('/get-all-cancelled-visits', verifyJWT, getAllCancelledVisits)
router.patch('/update-visit-staff/:id', verifyJWT, updateVisitStaff);

export default router;