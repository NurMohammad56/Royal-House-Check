import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isStaff } from "../middleware/role.middleware.js";
import { updateVisitNotes } from "../controller/visits.staff.controller.js";

const router = Router();

router.patch('/update-visit-notes/:id', verifyJWT, isStaff, updateVisitNotes);

export default router;