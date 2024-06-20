import mongoose, {
	type Document,
	Schema,
	type Model,
	type Query,
} from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "node:crypto";
export interface IUser extends Document {
	_id: Schema.Types.ObjectId;
	name: string;
	role: string;
	password: string | undefined;
	passwordConfirm: string | undefined;
	passwordChangedAt: Date | undefined;
	email: string;
	passwordResetToken: string | undefined;
	passwordResetExpires: Date | undefined;
	sessionIds: Schema.Types.ObjectId[];
	photo: string | undefined;
	active: boolean;
	correctPassword(
		candidatePassword: string,
		userPassword: string,
	): Promise<boolean>;
	changedPasswordAfter(JWTTimestamp: number): boolean;
	createPasswordResetToken(): string;
	socketIds: string[];
}
const userSchema: Schema<IUser> = new Schema({
	name: {
		type: String,
		required: [true, "name is required"],
		trim: true,
	},
	role: {
		type: String,
		enum: ["user", "guide", "lead-guide", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "password is required"],
		minlength: 8,
		select: false,
	},
	sessionIds: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "SessionId",
			},
		],
		default: [],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "password confirmation is required"],
		minlength: 8,
		validate: {
			validator: function (this: IUser, el: string): boolean {
				return el === this.password;
			},
			message: "passwords are not matching",
		},
		select: false,
	},
	passwordChangedAt: {
		type: Date,
		select: false,
	},
	email: {
		type: String,
		required: [true, "email is required"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "email is not valid"],
		trim: true,
	},
	passwordResetToken: String,
	passwordResetExpires: {
		type: Date,
		expires: 10 * 60 * 1000,
		select: false,
	},
	photo: String,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	socketIds: {
		type: [String],
		default: [],
	},
});

userSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password as string, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre<IUser>("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = new Date(Date.now() - 1000);
	next();
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
userSchema.pre<Query<any, IUser>>(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async function (
	this: IUser,
	candidatePassword: string,
	userPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
	this: IUser,
	JWTTimestamp: number,
): boolean {
	if (this.passwordChangedAt) {
		const changedTimestamp = Math.floor(
			this.passwordChangedAt.getTime() / 1000,
		);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function (this: IUser): string {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
	return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
