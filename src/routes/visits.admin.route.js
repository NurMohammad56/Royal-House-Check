import { Router } from "express";
import { createVisit, getAllCancelledVisits, getAllCompleteVisits, getAllConfirmedVisits, getAllPendingVisits, getAllVisitsCount, getPendingVisitsCount, updateVisitStaff } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-visit-admin", verifyJWT, createVisit);
router.get('/get-all-visits-count', verifyJWT, getAllVisitsCount);
router.get('/get-pending-visits-count', verifyJWT, getPendingVisitsCount)
router.get('/get-all-confirmed-visits', verifyJWT, getAllConfirmedVisits);
router.get('/get-all-pending-visits', verifyJWT, getAllPendingVisits);
router.get('/get-all-successful-visits', verifyJWT, getAllCompleteVisits);
router.get('/get-all-cancelled-visits', verifyJWT, getAllCancelledVisits)
router.patch('/update-visit/:id', verifyJWT, updateVisit);
router.patch('/update-visit-staff/:id', verifyJWT, updateVisitStaff);

export default router;