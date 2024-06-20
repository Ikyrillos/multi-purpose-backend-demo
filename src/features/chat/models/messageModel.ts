import { Schema, model, Document } from "mongoose";

interface IMessage extends Document {
  chatId: {
    type: Schema.Types.ObjectId;
    ref: "ChatSession";
  };
  senderId: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema({
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = model<IMessage>("Message", messageSchema);

export default Message;
