import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addIssue, getAllIssues } from "../controller/issues.controller.js";
import { uploadFields } from "../middleware/multer.middleware.js"; // import correctly
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.get('/get-all-issues/:visitId', verifyJWT, updateUserActivity, getAllIssues);

router.patch('/update-add-issue/:visitId', verifyJWT,updateUserActivity, uploadFields, addIssue);

export default router;
