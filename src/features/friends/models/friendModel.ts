import { Schema, model, type Document } from "mongoose";

interface Friendship extends Document {
	id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	friend: Schema.Types.ObjectId;
	status: string;
}

const FriendshipSchema = new Schema({
	id: { type: Schema.Types.ObjectId },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	friend: { type: Schema.Types.ObjectId, ref: "User" },
	status: { type: String, enum: ["confirmed", "pending", "rejected"] },
});

FriendshipSchema.index({ userId: 1, friendId: 1 });
const Friendship = model<Friendship>("Friendship", FriendshipSchema);

export default Friendship;
