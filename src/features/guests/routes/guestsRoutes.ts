import express from "express";

import { protect } from "../../authentication/controllers/authController";
import { createGuest, deleteGuest, getAllGuests, getGuest, updateGuest } from "../controller/GuestsCOntroller";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getAllGuests)
    .post(createGuest);

router
    .route("/:id")
    .get(getGuest)
    .patch(updateGuest)
    .delete(deleteGuest);

export default router;
