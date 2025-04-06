import { Router } from "express";
import { createVisit, getCancelledVisits, getSuccessfulVisits, getUpcomingVisits, getVisitById, updateVisit, updateVisitNotes, updateVisitStatus } from "../controller/visits.client.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/create-visit-client', verifyJWT, createVisit);
router.get('/get-upcoming-visits', verifyJWT, getUpcomingVisits);
router.get('/get-successful-visits', verifyJWT, getSuccessfulVisits);
router.get('/get-cancelled-visits', verifyJWT, getCancelledVisits)
router.get('/get-visit/:id', verifyJWT, getVisitById)
router.patch('/update-visit/:id', verifyJWT, updateVisit);
router.patch('/update-visit-status/:id', verifyJWT, updateVisitStatus);
router.patch('/update-visit-notes/:id', verifyJWT, updateVisitNotes);

export default router;