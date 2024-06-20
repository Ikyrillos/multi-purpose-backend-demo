import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../../../core/utils/catchAsync";
import * as factory from "../../authentication/controllers/handlerFactory";
import Cabin, { ICabin } from "../model/CabinsModel";
import { IUser } from "@/features/authentication/models/userModel";


// Extend the Request interface to include custom properties
interface CustomRequest extends Request {
    user?: IUser;
}

export const createCabin = catchAsync(
    async (req: CustomRequest, res: Response, _next: NextFunction) => {
        const newCabin = await Cabin.create({
            name: req.body.name,
            maxCapacity: req.body.maxCapacity,
            regularPrice: req.body.regularPrice,
            discount: req.body.discount,
            description: req.body.description,
            image: req.body.image,
        });
        res.status(201).json({
            status: "success",
            data: {
                data: newCabin,
            },
        });
    },
);

export const getCabin = factory.getOne(Cabin as Model<ICabin & Document>);
export const getAllCabins = factory.getAll(Cabin as Model<ICabin & Document>);
export const updateCabin = factory.updateOne(Cabin as Model<ICabin & Document>);
export const deleteCabin = factory.deleteOne(Cabin as Model<ICabin & Document>);
