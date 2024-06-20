import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../../../core/utils/catchAsync";
import * as factory from "../../authentication/controllers/handlerFactory";
import { IUser } from "@/features/authentication/models/userModel";
import Guest, { IGuest } from "../model/GuestsModel";


// Extend the Request interface to include custom properties
interface CustomRequest extends Request {
    user?: IUser;
}

export const createGuest = catchAsync(
    async (req: CustomRequest, res: Response, _next: NextFunction) => {
        const newGuests = await Guest.create({
            fullName: req.body.fullName,
            email: req.body.email,
            nationalId: req.body.nationalId,
            countryFlag: req.body.countryFlag,
        });
        res.status(201).json({
            status: "success",
            data: {
                data: newGuests,
            },
        });
    },
);

export const getGuest = factory.getOne(Guest as Model<IGuest & Document>);
export const getAllGuests = factory.getAll(Guest as Model<IGuest & Document>);
export const updateGuest = factory.updateOne(Guest as Model<IGuest & Document>);
export const deleteGuest = factory.deleteOne(Guest as Model<IGuest & Document>);
