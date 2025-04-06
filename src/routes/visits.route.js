import { Router } from "express";
import { createVisit, getCancelledVisits, getSuccessfulVisits, getUpcomingVisits, updateVisit } from "../controller/visits.controller";

const router = Router();

router.post('/create-visit', createVisit);
router.get('/get-upcoming-visits', getUpcomingVisits);
router.get('/get-successful-visits', getSuccessfulVisits);
router.get('/get-cancelled-visits', getCancelledVisits);
router.patch('/update-visit', updateVisit);

export default router;