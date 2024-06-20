import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../../../core/utils/catchAsync";
import * as factory from "../../authentication/controllers/handlerFactory";
import { IUser } from "@/features/authentication/models/userModel";
import Settings, { ISettings } from "../model/SettingsModel";


// Extend the Request interface to include custom properties
interface CustomRequest extends Request {
    user?: IUser;
}

export const createSetting = catchAsync(
    async (req: CustomRequest, res: Response, _next: NextFunction) => {
        const newSettings = await Settings.create({
            minBookingLength: req.body.minBookingLength,
            maxBookingLength: req.body.maxBookingLength,
            maxGuestsPerBooking: req.body.maxGuestsPerBooking,
            breakfastPrice: req.body.breakfastPrice,
        });
        res.status(201).json({
            status: "success",
            data: {
                data: newSettings,
            },
        });
    },
);

export const getSetting = factory.getOne(Settings as Model<ISettings & Document>);
export const getAllSettings = factory.getAll(Settings as Model<ISettings & Document>);
export const updateSetting = factory.updateOne(Settings as Model<ISettings & Document>);
export const deleteSetting = factory.deleteOne(Settings as Model<ISettings & Document>);
