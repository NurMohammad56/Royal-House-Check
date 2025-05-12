import express from "express";
import { createAddsOnService, deleteAddsOnService, getAllAddsOnServices, updateAddsOnService, addServiceToPlan, getPlanWithTotal, removeServiceFromPlan } from "../controller/addsOnService.controller.js";

const router = express.Router();

router.post("/create-addsOnService", createAddsOnService);
router.post("/:planId/addsOnService/:serviceId", addServiceToPlan);
router.get("/get-plan-with-total/:planId", getPlanWithTotal);
router.delete("/remove-service-from-plan/:planId/:serviceId", removeServiceFromPlan);
router.get("/get-all-addsOnService", getAllAddsOnServices);
router.put("/update-addsOnService/:id", updateAddsOnService);
router.delete("/delete-addsOnService/:id", deleteAddsOnService);


export default router;