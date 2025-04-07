import { Router } from "express";
import { createVisit, getAllVisitsCount, getCancelledVisits, getCompletedVisits, getConfirmedVisits, getPendingVisits, getPendingVisitsCount, updateVisit, updateVisitStaff } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.post("/create-visit", verifyJWT, isAdmin, createVisit);
router.get('/get-all-visits-count', verifyJWT, isAdmin, getAllVisitsCount);
router.get('/get-pending-visits-count', verifyJWT, isAdmin, getPendingVisitsCount)
router.get('/get-confirmed-visits', verifyJWT, isAdmin, getConfirmedVisits);
router.get('/get-pending-visits', verifyJWT, isAdmin, getPendingVisits);
router.get('/get-completed-visits', verifyJWT, isAdmin, getCompletedVisits);
router.get('/get-cancelled-visits', verifyJWT, isAdmin, getCancelledVisits)
router.patch('/update-visit/:id', verifyJWT, isAdmin, updateVisit);
router.patch('/update-visit-staff/:id', verifyJWT, isAdmin, updateVisitStaff);

export default router;