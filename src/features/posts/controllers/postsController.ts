import { Request, Response } from "express";
import Post, { IPost } from "../models/postModel";
import { RequestWithUser } from "../../authentication/types/authTypes";
import catchAsync from "../../../core/utils/catchAsync";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../authentication/controllers/handlerFactory";
import { IUser } from "../../authentication/models/userModel";

export const createPost = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { content, imageUrl } = req.body;
    const creator = req.user?._id; // Assuming user ID is available from session or JWT token

    const newPost: IPost = new Post({
      creator,
      content,
      imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
  }
);

export const getAllPosts = getAll(Post);

export const getPost = getOne(Post);

export const updatePost = updateOne(Post);

export const deletePost = deleteOne(Post);
