import { Router } from "express";
import {
  sendMessage,
  getMessages,
  getPendingMessageCount,
  getChatId,
  getAllConversations,
} from "../controller/messages.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { updateUserActivity } from "../middleware/updateUserActivity.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.get("/chat-id", verifyJWT, updateUserActivity, getChatId);
router.get(
  "/getallchat",
  verifyJWT,
  isAdmin,
  updateUserActivity,
  getAllConversations
);
router.post("/send", verifyJWT, updateUserActivity, sendMessage);
router.get("/:userId", verifyJWT, updateUserActivity, getMessages);
router.get(
  "/pending-count/:userId",
  verifyJWT,
  updateUserActivity,
  getPendingMessageCount
);

export default router;
