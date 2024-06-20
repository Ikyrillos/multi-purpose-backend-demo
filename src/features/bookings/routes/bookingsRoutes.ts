import express from "express";

import { protect } from "../../authentication/controllers/authController";
import { createBooking, deleteBooking, getAllBookings, getBooking, updateBooking } from "../controller/bookingsController";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getAllBookings)
    .post(createBooking);

router
    .route("/:id")
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking);

export default router;
