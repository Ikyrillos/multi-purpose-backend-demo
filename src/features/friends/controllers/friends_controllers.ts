import catchAsync from "@/core/utils/catchAsync";
import User, { type IUser } from "../../authentication/models/userModel";
import type { NextFunction, Request, Response } from "express";
import Friendship from "../models/friendModel";
import { ClientSession } from "mongoose";
import RemovedFriendship from "../models/removedFriendModel";

// get all friends by current user id
export const getAllFriends = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { user } = req;
		const friends = await Friendship.find({ user: user?._id }).populate(
			"friend",
		);
		return res.status(200).json({ friends });
	},
);
export const addFriend = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { friendId } = req.body;
		const currentUserId = req.user?._id;

		// Validate if friendId is provided
		if (!friendId) {
			 return res.status(400).json({ message: "Friend ID is required." });
		}


		
		// Check if the friend exists
		const friendExists = await User.exists({ _id: friendId });

		if (!friendExists) {
			 return res.status(404).json({ message: "Friend not found." });
		}


		// Check if the friend is already in the user's friends list
		const friendship = await Friendship.findOne({
			user: currentUserId,
			friend: friendId,
		});

		if (friendship && friendship.status === "confirmed") {
			return res
				.status(400)
				.json({ message: "Friend is already in your friends list." });
		}

		// Add the friend to the user's friends list
		const isDev = process.env.NODE_ENV === "development";
		const newFriendship = await Friendship.create({
			user: currentUserId,
			friend: friendId,
			status: isDev ? "confirmed" : "pending",
		});

		res.status(200).json({
			message: "Friend added successfully.",
			data: newFriendship,
		});
	},
);
export const removeFriend = catchAsync(
	async (
		req: Request & { user?: IUser },
		res: Response,
		_next: NextFunction,
		session: ClientSession,
	) => {
		const { friendId } = req.body;
		const currentUserId = req.user?._id;
		// Validate if friendId is provided
		if (!friendId) {
			return res.status(400).json({ message: "Friend ID is required." });
		}

		// Check if the friendship exists and is confirmed
		const friendshipExists = await Friendship.findOne(
			{
				user: currentUserId,
				friend: friendId,
				status: {
					$in :["confirmed","pending"]
				},
			},
			null,
			{ session },
		);

		if (!friendshipExists) {
			return res.status(404).json({ message: "Friendship not found." });
		}
		// Remove the friend from the Friendship collection
		await Friendship.deleteOne(
			{ user: currentUserId, friend: friendId, status: "confirmed" },
			{ session },
		);

		// Log the removal in the RemovedFriendship collection
		await RemovedFriendship.create(
			[
				{
					user: currentUserId,
					friend: friendId,
					status: "rejected",
				},
			],
			{ session },
		);

		// throw new Error("Friend Error");

		res.status(200).json({ message: "Friend removed successfully." });
	},
);
