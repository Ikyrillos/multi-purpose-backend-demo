import type { Response, NextFunction } from "express";
import type { Document, Model } from "mongoose";
import User, { type IUser } from "../../authentication/models/userModel"; // Assuming IUser is the interface for User documents
import catchAsync from "../../../core/utils/catchAsync";
import AppError from "../../../core/utils/appError";
import * as factory from "../../authentication/controllers/handlerFactory";
import type { RequestWithUser } from "../../authentication/types/authTypes";

const filterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
	const newObj: { [key: string]: any } = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};

export const getMe = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		return next(new AppError("User is not authenticated", 401));
	}
	req.params.id = req.user.id;
	next();
};

export const updateMe = catchAsync(
	async (req: RequestWithUser, res: Response, next: NextFunction) => {
		if (req.body.password || req.body.passwordConfirm) {
			return next(
				new AppError(
					"This route is not for password updates. Please use /updateMyPassword.",
					400,
				),
			);
		}

		const filteredBody = filterObj(req.body, "name", "email");

		const updatedUser = await User.findByIdAndUpdate(
			req.user!.id,
			filteredBody,
			{
				new: true,
				runValidators: true,
			},
		);

		res.status(200).json({
			status: "success",
			data: {
				user: updatedUser,
			},
		});
	},
);

export const deleteMe = catchAsync(
	async (req: RequestWithUser, res: Response, next: NextFunction) => {
		if (!req.user) {
			return next(new AppError("User is not authenticated", 401));
		}

		await User.findByIdAndUpdate(req.user.id, { active: false });

		res.status(204).json({
			status: "success",
			data: null,
		});
	},
);

export const createUser = (req: RequestWithUser, res: Response) => {
	res.status(500).json({
		status: "error",
		message: "This route is not defined! Please use /signup instead",
	});
};

export const getUser = factory.getOne(User as Model<IUser & Document>);
export const getAllUsers = factory.getAll(User as Model<IUser & Document>);
export const updateUser = factory.updateOne(User as Model<IUser & Document>);
export const deleteUser = factory.deleteOne(User as Model<IUser & Document>);
