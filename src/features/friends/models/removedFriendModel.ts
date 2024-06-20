import { Schema, model, type Document } from "mongoose";

interface RemovedFriendship extends Document {
	id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	friend: Schema.Types.ObjectId;
	status: string;
}

const RemovedFriendshipSchema = new Schema({
	id: { type: Schema.Types.ObjectId },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	friend: { type: Schema.Types.ObjectId, ref: "User" },
	status: { type: String, enum: ["confirmed", "pending", "rejected"] },
});

RemovedFriendshipSchema.index({ userId: 1, friendId: 1 });
const RemovedFriendship = model<RemovedFriendship>(
	"RemovedFriendship",
	RemovedFriendshipSchema,
);

export default RemovedFriendship;
