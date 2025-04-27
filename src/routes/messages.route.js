import { Router } from "express";
import { sendMessage, getMessages, getPendingMessageCount } from "../controller/messages.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";


const router = Router();

router.post("/send", verifyJWT, updateUserActivity, sendMessage);
router.get("/:userId", verifyJWT, updateUserActivity, getMessages);
router.get("/pending-count/:userId", verifyJWT, updateUserActivity, getPendingMessageCount);

export default router;