import { Schema, model, type Document } from "mongoose";

interface IChatSession extends Document {
	members: Schema.Types.ObjectId[]; // Array of user IDs
	isGroup: boolean;
	owner: Schema.Types.ObjectId;
	isReadOnly: boolean;
	name?: {
		type: string;
		trim: true;
	}; // Optional name for group chats
}

const chatSessionSchema = new Schema({
	members: [{ type: Schema.Types.ObjectId, ref: "User" }],
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	isGroup: { type: Boolean, required: true },
	isReadOnly: { type: Boolean, default: false },
	name: { type: String },
});

chatSessionSchema.index({ members: 1, isGroup: 1 });
chatSessionSchema.index({ owner: 1 });
const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);

export default ChatSession;
