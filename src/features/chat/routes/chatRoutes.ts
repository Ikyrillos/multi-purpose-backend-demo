import express from "express";
import * as chatController from "../controllers/chatControllers";
import { protect } from "../../authentication/controllers/authController";

const router = express.Router();

router.use(protect);

router
	.route("/")
	.post(chatController.createChatSession)
	.get(chatController.getAllChatSessions);
router.route("/join").post(chatController.joinChat);

router.route("/leave").post(chatController.leaveRoom);

router
	.route("/messages/:sessionId")
	.post(chatController.sendMessage)
	.get(chatController.getChatMessages);

router.route("/add-chat-session").post(chatController.addChatSessionToUser);

router.route("/add-socket").post(chatController.addSocketIdToUser);

export default router;
