import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../../authentication/models/userModel";

// Interface for the Post document
export interface IPost extends Document {
  creator: IUser["_id"]; // Reference to User model
  content: string;
  imageUrl: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: IUser["_id"][]; // Array of user IDs who liked the post
  comments: IComment[]; // Embedded subdocument array for comments
}

// Interface for the Comment subdocument
export interface IComment extends Document {
  commenter: IUser["_id"];
  comment: string;
  createdAt: Date;
}

// Comment sub-schema
const CommentSchema: Schema = new Schema({
  commenter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Post schema
const PostSchema: Schema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    imageUrl: [{ type: String }], // Array of image URLs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  {
    timestamps: true, // Handles createdAt and updatedAt automatically
  }
);

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
