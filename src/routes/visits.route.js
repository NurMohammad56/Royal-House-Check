import { Router } from "express";
import { createVisit, getCancelledVisits, getSuccessfulVisits, getUpcomingVisits, getVisitById, updateVisit, updateVisitStaff, updateVisitStatus } from "../controller/visits.controller.js";

const router = Router();

router.post('/create-visit', createVisit);
router.get('/get-upcoming-visits', getUpcomingVisits);
router.get('/get-successful-visits', getSuccessfulVisits);
router.get('/get-cancelled-visits', getCancelledVisits)
router.get('/get-visit/:id', getVisitById)
router.patch('/update-visit', updateVisit);
router.patch('/update-visit-status', updateVisitStatus);
router.patch('/update-visit-staff', updateVisitStaff);

export default router;