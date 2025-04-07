import { Router } from "express";
import { sendMessage, getMessages } from "../controller/messages.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/send", verifyJWT, sendMessage);
router.get("/:userId", verifyJWT, getMessages);

export default router;