import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../../../core/utils/catchAsync";
import * as factory from "../../authentication/controllers/handlerFactory";
import { IUser } from "@/features/authentication/models/userModel";
import Booking, { IBooking } from "../model/BookingsModel";


// Extend the Request interface to include custom properties
interface CustomRequest extends Request {
    user?: IUser;
}

export const createBooking = catchAsync(
    async (req: CustomRequest, res: Response, _next: NextFunction) => {
        const newBooking = await Booking.create({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            numNights: req.body.numNights,
            numGuests: req.body.numGuests,
            BookingPrice: req.body.BookingPrice,
            extrasPrice: req.body.extrasPrice,
            totalPrice: req.body.totalPrice,
            hasBreakfast: req.body.hasBreakfast,
            observations: req.body.observations,
            BookingId: req.body.BookingId,
            guestId: req.body.guestId,
        });
        res.status(201).json({
            status: "success",
            data: {
                data: newBooking,
            },
        });
    },
);

export const getBooking = factory.getOne(Booking as Model<IBooking & Document>);
export const getAllBookings = factory.getAll(Booking as Model<IBooking & Document>);
export const updateBooking = factory.updateOne(Booking as Model<IBooking & Document>);
export const deleteBooking = factory.deleteOne(Booking as Model<IBooking & Document>);
