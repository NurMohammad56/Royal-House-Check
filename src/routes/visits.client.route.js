import { Router } from "express";
import { createVisit, getCancelledVisits, getConfirmedVisits, getAllVisits, getPendingVisits, getCompletedVisits, updateVisit, getNextVisit, getPastVisits, getUpcomingVisits, getRoutineCheckVisits, getEmergencyVisits, getFollowUpVisits, getCompletedVisitsPagination, getCompletedVisitsWithIssues } from "../controller/visits.client.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isClient } from "../middleware/role.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.post('/create-visit', verifyJWT, isClient, updateUserActivity, createVisit)

router.get('/get-all-visits', verifyJWT, isClient, updateUserActivity, getAllVisits);

router.get('/get-confirmed-visits', verifyJWT, isClient, updateUserActivity, getConfirmedVisits);

router.get('/get-pending-visits', verifyJWT, isClient, updateUserActivity, getPendingVisits);

router.get('/get-completed-visits', verifyJWT, isClient, updateUserActivity, getCompletedVisits);

router.get('/get-completed-visits-pagination', verifyJWT, isClient, updateUserActivity, getCompletedVisitsPagination);

router.get('/get-completed-visits-with-issues', verifyJWT, isClient, updateUserActivity, getCompletedVisitsWithIssues);

router.get('/get-cancelled-visits', verifyJWT, isClient, updateUserActivity, getCancelledVisits)

router.get('/get-past-visits', verifyJWT, isClient, updateUserActivity, getPastVisits)

router.get('/get-upcoming-visits', verifyJWT, isClient, updateUserActivity, getUpcomingVisits)

router.get('/get-routineCheck-visits', verifyJWT, isClient, updateUserActivity, getRoutineCheckVisits)

router.get('/get-emergency-visits', verifyJWT, isClient, updateUserActivity, getEmergencyVisits)

router.get('/get-followUp-visits', verifyJWT, isClient, updateUserActivity, getFollowUpVisits)

router.get('/get-next-visit', verifyJWT, isClient, updateUserActivity, getNextVisit)

router.patch('/update-visit/:id', verifyJWT, isClient, updateUserActivity, updateVisit);

export default router;