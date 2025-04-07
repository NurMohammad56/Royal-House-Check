import { Router } from "express";

const router = Router();

router.get('/get-all-issues/:id', verifyJWT, getAllIssues)
router.patch('/update-add-issue/:id', verifyJWT, addIssue)

export default router;