import { Router } from "express";
import { createVisit, getCancelledVisits, getConfirmedVisits, getPendingVisits, getCompletedVisits, updateVisit, getNextVisit, getPastVisits, getUpcomingVisits } from "../controller/visits.client.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isClient } from "../middleware/role.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.post('/create-visit', verifyJWT, isClient, updateUserActivity, createVisit);
router.get('/get-confirmed-visits', verifyJWT, isClient,updateUserActivity, getConfirmedVisits);
router.get('/get-pending-visits', verifyJWT, isClient,updateUserActivity, getPendingVisits);
router.get('/get-completed-visits', verifyJWT, isClient,updateUserActivity, getCompletedVisits);
router.get('/get-cancelled-visits', verifyJWT, isClient,updateUserActivity, getCancelledVisits)
router.get('/get-past-visits', verifyJWT, isClient,updateUserActivity, getPastVisits)
router.get('/get-upcoming-visits', verifyJWT, isClient, updateUserActivity,getUpcomingVisits)
router.get('/get-next-visit', verifyJWT, isClient,updateUserActivity, getNextVisit)
router.patch('/update-visit/:id', verifyJWT, isClient,updateUserActivity, updateVisit);

export default router;