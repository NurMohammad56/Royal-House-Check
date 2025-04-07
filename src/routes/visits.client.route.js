import { Router } from "express";
import { createVisit, getCancelledVisits, getConfirmedVisits, getPendingVisits, getCompletedVisits, getVisitById, updateVisit, updateVisitNotes } from "../controller/visits.client.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isClient } from "../middleware/role.middleware.js";

const router = Router();

router.post('/create-visit', verifyJWT, isClient, createVisit);
router.get('/get-confirmed-visits', verifyJWT, isClient, getConfirmedVisits);
router.get('/get-pending-visits', verifyJWT, isClient, getPendingVisits);
router.get('/get-completed-visits', verifyJWT, isClient, getCompletedVisits);
router.get('/get-cancelled-visits', verifyJWT, isClient, getCancelledVisits)
router.get('/get-visit/:id', verifyJWT, isClient, getVisitById)
router.patch('/update-visit/:id', verifyJWT, isClient, updateVisit);
router.patch('/update-visit-notes/:id', isClient, verifyJWT, updateVisitNotes);

export default router;