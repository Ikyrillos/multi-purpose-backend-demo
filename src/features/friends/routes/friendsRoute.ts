import express from "express";
import {
	addFriend,
	getAllFriends,
	removeFriend,
} from "../controllers/friends_controllers";
import { protect } from "../../authentication/controllers/authController";

const router = express.Router();

router.use(protect);

router.get("/", getAllFriends);

router.post("/add", addFriend);

router.delete("/remove", removeFriend);

export default router;
