import { Router } from "express";
import { getAdminAllVisit, createVisit, getAllVisitsCount, getCancelledVisits, getCompletedVisitsPagination, getAllVisits, getCompletedVisits, getConfirmedVisits, getConfirmedVisitsCount, getInProgressVisitsCount, getPendingVisits, getPendingVisitsCount, getUpcomingVisits, updateVisit, updateVisitStaff, getCompletedVisitsWithIssues } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.get("/get-all-visit", getAdminAllVisit);

router.post("/create-visit", verifyJWT, isAdmin, createVisit);

router.get('/get-all-visits-count', verifyJWT, isAdmin, getAllVisitsCount);

router.get('/get-pending-visits-count', verifyJWT, isAdmin, getPendingVisitsCount)

router.get('/get-confirmed-visits-count', verifyJWT, isAdmin, getConfirmedVisitsCount)

router.get('/get-inProgress-visits-count', verifyJWT, isAdmin, getInProgressVisitsCount)

router.get('/get-all-visits/:client', verifyJWT, isAdmin, getAllVisits);

router.get('/get-confirmed-visits/:client', verifyJWT, isAdmin, getConfirmedVisits);

router.get('/get-pending-visits/:client', verifyJWT, isAdmin, getPendingVisits);

router.get('/get-completed-visits/:client', verifyJWT, isAdmin, getCompletedVisits);

router.get('/get-completed-visits-pagination/:client', verifyJWT, isAdmin, getCompletedVisitsPagination);

router.get('/get-completed-visits-with-issues/:client', verifyJWT, isAdmin, getCompletedVisitsWithIssues);

router.get('/get-cancelled-visits/:client', verifyJWT, isAdmin, getCancelledVisits)

// router.get('/get-past-visits/:client', verifyJWT, isAdmin, getPastVisits)

// router.get('/get-visits-type/:type', verifyJWT, isAdmin, getVisitsByType)

router.get('/get-upcoming-visits/:client', verifyJWT, isAdmin, getUpcomingVisits)

router.patch('/update-visit/:id', verifyJWT, isAdmin, updateVisit)

router.patch('/update-visit-staff/:id', verifyJWT, isAdmin, updateVisitStaff)

export default router;