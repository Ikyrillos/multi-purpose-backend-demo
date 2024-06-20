import { IUser } from "@/features/authentication/models/userModel";


// Extend the Request interface to include custom properties
export interface CustomRequest extends Request {
    user?: IUser;
}