import express from "express";

import { protect } from "../../authentication/controllers/authController";
import { createCabin, deleteCabin, getAllCabins, getCabin, updateCabin } from "../controller/cabinsController";

const router = express.Router();


router.get("/", getAllCabins)
router.get("/:id", getCabin)


router.post("/", createCabin);
router.route("/:id")
    .patch(updateCabin)
    .delete(deleteCabin);

export default router;
