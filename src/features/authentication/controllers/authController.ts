import type { Request, Response, NextFunction } from "express";
import { promisify } from "util";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import crypto from "crypto";
import catchAsync from "../../../core/utils/catchAsync";
import AppError from "../../../core/utils/appError";
import sendEmail from "../../../core/utils/email";
import User, { type IUser } from "../models/userModel";
import type { RequestWithUser } from "../types/authTypes";
import bcrypt from "bcryptjs";

interface DecodedToken extends JwtPayload {
	id: string;
	iat: number;
}

const verifyJwt = (token: string, secret: Secret): Promise<DecodedToken> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded as DecodedToken);
		});
	});
};
const signJwt = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRATION,
	});
};

// Generate Refresh Token
export const generateRefreshToken = (user: IUser): string => {
	// Generate a new refresh token using user information and a secret key
	const refreshToken = signJwt(user._id.toString());

	return refreshToken;
};

// Verify Refresh Token

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
	const token = signJwt(user._id.toString());
	const cookieOptions: {
		expires: Date;
		httpOnly: boolean;
		secure?: boolean; // Make secure optional
	} = {
		expires: new Date(
			Date.now() +
				Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

export const signup = catchAsync(
	async (req: Request, res: Response, _next: NextFunction) => {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		});
		createSendToken(newUser, 201, res);
	},
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(new AppError("Please provide email and password", 400));
		}

		const user = await User.findOne({ email }).select("+password +sessionIds");

		if (
			!user ||
			!(await user.correctPassword(password, user.password as string))
		) {
			return next(new AppError("Incorrect email or password", 401));
		}

		createSendToken(user, 200, res);
	},
);

export const protect = catchAsync(
	async (
		req: Request & { user?: IUser },
		_res: Response,
		next: NextFunction,
	) => {
		let token: string | undefined;

		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			next(
				new AppError(
					"You are not logged in! Please log in to get access.",
					401,
				),
			);
			return;
		}
		const decoded = await verifyJwt(token, process.env.JWT_SECRET!);

		const currentUser = await User.findById(decoded.id);

		if (!currentUser) {
			next(
				new AppError(
					"The user belonging to this token does no longer exist.",
					401,
				),
			);
			return;
		}

		if (currentUser.changedPasswordAfter(decoded.iat)) {
			next(
				new AppError(
					"User recently changed password! Please log in again.",
					401,
				),
			);
			return;
		}

		req.user = currentUser;
		next();
	},
);

export const restrictTo =
	(...roles: string[]) =>
	(req: RequestWithUser, _res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action", 403),
			);
		}

		next();
	};

export const forgotPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return next(new AppError("There is no user with email address.", 404));
		}

		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });

		const resetURL = `${req.protocol}://${req.get(
			"host",
		)}/api/v1/users/resetPassword/${resetToken}`;

		const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

		try {
			await sendEmail({
				email: user.email,
				subject: "Your password reset token (valid for 10 min)",
				message,
			});

			res.status(200).json({
				status: "success",
				message: "Token sent to email!",
			});
		} catch (err) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			return next(
				new AppError(
					"There was an error sending the email. Try again later!",
					500,
				),
			);
		}
	},
);

export const resetPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const hashedToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			return next(new AppError("Token is invalid or has expired", 400));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		createSendToken(user, 200, res);
	},
);

export const updatePassword = catchAsync(
	async (req: RequestWithUser, res: Response, next: NextFunction) => {
		const user = await User.findById(req.user.id).select("+password");

		if (!user) {
			next(new AppError("No user found with that ID", 404));
			return;
		}

		if (
			!(await user.correctPassword(
				req.body.passwordCurrent,
				user.password ?? "",
			))
		) {
			return next(new AppError("Your current password is wrong.", 401));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		await user.save();

		createSendToken(user, 200, res);
	},
);
