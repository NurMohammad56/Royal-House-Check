import { Router } from "express";
import { createVisit, getAllVisitsCount, getCancelledVisits, getCompletedVisits, getConfirmedVisits, getPendingVisits, getPendingVisitsCount, updateVisit, updateVisitStaff } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-visit-admin", verifyJWT, createVisit);
router.get('/get-all-visits-count', verifyJWT, getAllVisitsCount);
router.get('/get-pending-visits-count', verifyJWT, getPendingVisitsCount)
router.get('/get-confirmed-visits', verifyJWT, getConfirmedVisits);
router.get('/get-pending-visits', verifyJWT, getPendingVisits);
router.get('/get-successful-visits', verifyJWT, getCompletedVisits);
router.get('/get-cancelled-visits', verifyJWT, getCancelledVisits)
router.patch('/update-visit/:id', verifyJWT, updateVisit);
router.patch('/update-visit-staff/:id', verifyJWT, updateVisitStaff);

export default router;