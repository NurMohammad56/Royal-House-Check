import express from "express";
import { createAddsOnService, deleteAddsOnService, getAddsOnServiceById, getAllAddsOnServices, updateAddsOnService } from "../controller/addsOnService.controller.js";

const router = express.Router();

router.post("/create-addsOnService", createAddsOnService);
router.get("/get-all-addsOnService", getAllAddsOnServices);
router.get("/get-addsOnService/:id", getAddsOnServiceById);
router.put("/update-addsOnService/:id", updateAddsOnService);
router.delete("/delete-addsOnService/:id", deleteAddsOnService);

export default router;