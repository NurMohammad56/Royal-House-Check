import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin, isClient } from "../middleware/role.middleware.js";
import { addAddsOnService } from "../controller/addsOnService.controller.js";

const router = express.Router();

router.post("/add-addsOnService", verifyJWT, isClient, addAddsOnService);

export default router;