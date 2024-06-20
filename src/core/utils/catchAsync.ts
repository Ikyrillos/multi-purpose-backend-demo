import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../../features/authentication/models/userModel";
import type { ClientSession } from "mongoose";
import mongoose from "mongoose";

const catchAsync =
	<TReq extends Request & { user?: IUser }>(
		fn: (
			req: TReq,
			res: Response,
			next: NextFunction,
			session: ClientSession,
		) => Promise<unknown>,
	) =>
	async (req: TReq, res: Response, next: NextFunction): Promise<void> => {
		const session = await mongoose.startSession();

		try {
			session.startTransaction();

			await fn(req, res, next, session);
			await session.commitTransaction();
		} catch (err) {
			await session.abortTransaction();
			next(err);
		} finally {
			session.endSession();
		}
	};
export default catchAsync;
