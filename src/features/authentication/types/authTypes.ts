import { IUser } from "../models/userModel";
import { Request } from "express";
export interface RequestWithUser extends Request {
  // user: Document<unknown, {}, UserDocument> & UserDocument & { _id: string };
  user: IUser;
}
