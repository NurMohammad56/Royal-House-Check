import { Router } from "express";
import { getAdminAllVisit, getSpecificVisit, createVisit, getAllVisitsCount, getEmails, getCancelledVisits, getCompletedVisitsPagination, getCompletedVisits, getConfirmedVisits, getUpcomingVisits, updateVisit, updateVisitStaff, getCompletedVisitsWithIssues, getAllPendingVisits } from "../controller/visits.admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.get("/get-all-visit", getAdminAllVisit);

router.post("/create-visit-admin", verifyJWT, createVisit);

router.get('/get-emails', verifyJWT, getEmails);

router.get('/get-all-visits-count',  getAllVisitsCount);

router.get('/get-confirmed-visits/:client',  getConfirmedVisits);

router.get('/get-pending-visits',  getAllPendingVisits);

router.get('/get-completed-visits/:client',  getCompletedVisits);

router.get('/get-completed-visits-pagination/:client',  getCompletedVisitsPagination);

router.get('/get-completed-visits-with-issues/:client',  getCompletedVisitsWithIssues);

router.get('/get-cancelled-visits/:client',  getCancelledVisits)

// router.get('/get-past-visits/:client', verifyJWT, isAdmin, getPastVisits)

// router.get('/get-visits-type/:type', verifyJWT, isAdmin, getVisitsByType)

router.get('/get-upcoming-visits',  getUpcomingVisits)

router.patch('/update-visit/:id',  updateVisit)

router.patch('/update-visit-staff/:id',  updateVisitStaff)

router.get('/get-specific-visit/:id',  getSpecificVisit)

export default router;