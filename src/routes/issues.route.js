import { Router } from "express";
import { isStaff } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addIssue, getAllIssues } from "../controller/issues.controller.js";

const router = Router();

router.get('/get-all-issues/:visitId', verifyJWT, getAllIssues)
router.patch('/update-add-issue/:visitId', verifyJWT, isStaff, addIssue)

export default router;