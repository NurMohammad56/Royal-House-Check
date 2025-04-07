import express from "express";
import {
    getAllDiscounts,
    addDiscount,
    updateDiscount,
    deleteDiscount,
} from "../controller/discount.controller.js";
import { verifyJWT} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, isAdmin, getAllDiscounts);
router.post("/", verifyJWT, isAdmin, addDiscount);
router.put("/:id", verifyJWT, isAdmin, updateDiscount);
router.delete("/:id", verifyJWT, isAdmin, deleteDiscount);

export default router;