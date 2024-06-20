// src/controllers/chatController.ts

import { io } from "@/app";
import catchAsync from "@/core/utils/catchAsync";
import { SessionId } from "@/features/authentication/models/sessionIdModel";
import User, { type IUser } from "@/features/authentication/models/userModel";
import ChatSession from "@/features/chat/models/chatSessionModel";
import Message from "@/features/chat/models/messageModel";
import { getSocketServer } from "@/features/chat/utils/socket"; // This should be configured to export your socket.io instance
import type { Request, Response } from "express";
import mongoose, { type ObjectId } from "mongoose";

export const createChatSession = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { name, members, isGroup, isReadOnly } = req.body;
		const currentUserId = req.user?._id;

		// Validate the request body, ensure members are provided
		if (!members || !members.length) {
			return res
				.status(400)
				.json({ message: "Members are required to create a session." });
		}

		// Find or create the chat session between the current user and the specified members
		const existingChatSession = await ChatSession.findOne({
			members: { $all: [currentUserId, ...members] }, // Check for bidirectional chat
		});

		let newSession;
		if (existingChatSession) {
			// Chat session already exists, return it
			newSession = existingChatSession;
			return res.status(200).json({
				message: "Chat session found",
				session: newSession,
			});
		}
		// Create a new chat session
		newSession = new ChatSession({
			name: name,
			members: [currentUserId, ...members],
			isGroup: isGroup,
			owner: currentUserId,
			isReadOnly: isReadOnly,
		});
		const newRoom = await newSession.save({});

		const userIds = [
			currentUserId,
			...members.map((member: IUser) => member._id),
		];

		// Use updateMany to update all matching documents
		await User.updateMany(
			{ _id: { $in: userIds } },
			{ $push: { sessionIds: newRoom._id } },
		);
		return res.status(201).json({
			message: "Chat session created successfully",
			session: newSession,
		});
	},
);
export const sendMessage = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { content } = req.body;
		const sessionId = req.params.sessionId;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const userId = req.user!._id; // Assuming req.user is populated from authentication middleware

		const session = await ChatSession.findById(sessionId);

		if (session?.isReadOnly && !(userId === session?.owner)) {
			return res
				.status(403)
				.json({ message: "Only the owner of the group can send messages" });
		}

		if (!session || !session.members.includes(userId)) {
			return res
				.status(404)
				.json({ message: "Session not found or access denied" });
		}

		const newMessage = new Message({
			chatId: sessionId,
			senderId: userId,
			content: content,
			timestamp: new Date(),
		});

		await newMessage.save();

		const receivingUsers = session.members.filter(
			(member) => member.toString() !== userId.toString(),
		);
		const users = await User.find({ _id: { $in: receivingUsers } });
		// receivers socket excluding the sender which is the current user
		const onlyReceivers = users.filter(
			(user) => user._id.toString() !== userId.toString(),
		);
		const receiversSocketIds = onlyReceivers.flatMap((user) => user.socketIds);

		io.to(receiversSocketIds).emit("chat message", newMessage.toObject());

		return res.status(201).json(newMessage);
	},
);

export const getChatMessages = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const sessionId = req.params.sessionId;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const userId = req.user!._id;

		const session = await ChatSession.findById(sessionId);

		if (!session) {
			return res
				.status(404)
				.json({ message: "Session not found or access denied" });
		}

		if (!session.members.includes(userId)) {
			return res.status(403).json({ message: "Access denied" });
		}

		const messages = await Message.aggregate([
			{
				$match: { chatId: sessionId },
			},
			{
				$addFields: {
					timestampAsDate: { $toDate: "$timestamp" },
				},
			},
			{
				$sort: { timestampAsDate: 1 },
			},
		]);

		return res.status(200).json({ messages });
	},
);

export const joinChat = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { sessionId } = req.body;
		const userId = req.user!._id;
		const session = await ChatSession.findById(sessionId, {
			validate: false,
		});
		if (!session) {
			return res.status(404).json({
				message: "Already Joined / Chat session not found or access denied",
			});
		}

		if (session.members.includes(userId)) {
			return res.status(200).json({ message: "Already Joined" });
		}

		getSocketServer().on("connection", (socket) => {
			socket.join(sessionId);
		});

		// Add the user to the members array
		session.members.push(userId);
		// Save the updated session
		await ChatSession.findByIdAndUpdate(sessionId, {
			members: session.members,
		});

		return res
			.status(200)
			.json({ message: "Joined the chat session successfully" });
	},
);

export const broadcastMessage = catchAsync(
	async (
		req: Request & { user?: IUser & { isAdmin?: boolean } },
		res: Response,
	) => {
		const { content } = req.body;
		const userId = req.user!._id;

		if (!req.user?.isAdmin) {
			return res.status(403).json({ message: "Access denied" });
		}

		const newMessage = new Message({
			senderId: userId,
			content: content,
			timestamp: new Date(),
		});

		await newMessage.save();
		getSocketServer().emit("broadcast_message", newMessage);
		return res.status(201).json(newMessage);
	},
);

export const leaveRoom = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { sessionId } = req.body;
		const userId = req.user!._id;

		const session = await ChatSession.findById(sessionId, {
			validate: false,
		});

		if (!session) {
			return res.status(404).json({
				message: "Chat session not found or access denied",
			});
		}

		if (!session.members.includes(userId)) {
			return res.status(200).json({ message: "Already left the chat" });
		}

		await ChatSession.findByIdAndUpdate(sessionId, {
			members: session.members.filter(
				(member: ObjectId) => !(member === userId),
			),
		});

		return res.status(200).json({ message: "Left the room successfully" });
	},
);

export const addChatSessionToUser = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { sessionId } = req.body;
		const userId = req.user?._id;

		const newSession = await SessionId.create({
			sessionId: sessionId,
		});
		console.log(newSession);

		const user = await User.findByIdAndUpdate(
			userId,
			{
				$push: {
					sessionIds: newSession,
				},
			},
			{
				new: true,
			},
		);
		console.log(user);
		return res.status(201).json({ message: "Session added successfully" });
	},
);

export const getAllChatSessions = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const userId = req.user?._id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const sessions = await ChatSession.find({
			members: {
				$in: [userId],
			},
		});

		return res.status(200).json({ sessions });
	},
);

export const addSocketIdToUser = catchAsync(
	async (req: Request & { user?: IUser }, res: Response) => {
		const { socketId } = req.body;
		const userId = req.user?._id;

		await User.findByIdAndUpdate(userId, {
			$push: {
				socketIds: socketId,
			},
		});

		return res.status(201).json({ message: "Socket ID added successfully" });
	},
);

export const removeSocketIdFromUser = async (socketId: string) => {
	console.log("socketId", socketId);
	await User.findOneAndUpdate(
		{
			socketIds: socketId,
		},
		{
			$pull: {
				socketIds: socketId,
			},
		},
	);
};
