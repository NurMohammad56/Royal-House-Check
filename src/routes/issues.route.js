import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addIssue, getAllIssues } from "../controller/issues.controller.js";
import { uploadFields } from "../middleware/multer.middleware.js"; // import correctly

const router = Router();

router.get('/get-all-issues/:visitId', verifyJWT, getAllIssues);

router.patch('/update-add-issue/:visitId', uploadFields, addIssue);

export default router;
