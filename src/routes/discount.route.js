import express from "express";
import {
    getAllDiscounts,
    addDiscount,
    updateDiscount,
    deactivteDiscount,
    deleteDiscount
} from "../controller/discount.controller.js";
import { verifyJWT} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, isAdmin, getAllDiscounts);
router.post("/add", verifyJWT, isAdmin, addDiscount);
router.put("/update/:id", verifyJWT, isAdmin, updateDiscount);
router.put("/deactivate/:id", verifyJWT, isAdmin, deactivteDiscount);
router.delete("/delete/:id", verifyJWT, isAdmin, deleteDiscount);

export default router;