import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addIssue, getAllIssues, getAllVisitsWithIssues, deleteVisit } from "../controller/issues.controller.js";
import { uploadFields } from "../middleware/multer.middleware.js"; 
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.get('/get-issue/:visitId', verifyJWT, updateUserActivity, getAllIssues);
router.get('/get-all-visits-with-issues', verifyJWT, updateUserActivity, getAllVisitsWithIssues);
router.patch('/update-add-issue', verifyJWT,updateUserActivity, uploadFields, addIssue);
router.delete('/delete-visit/:visitId', verifyJWT, updateUserActivity, deleteVisit);

export default router;
