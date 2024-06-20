import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface IGuest extends Document {
    createdAt: Date;
    fullName: string;
    email: string;
    nationalId: string;
    nationality: string;
    countryFlag: string;
}

// Create a Schema corresponding to the document interface.
const GuestSchema = new Schema<IGuest>({
    createdAt: { type: Date, default: Date.now },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    nationalId: { type: String, required: true },
    nationality: { type: String, required: true },
    countryFlag: { type: String, required: true },
});

// Create a Model.
const Guest = model<IGuest>('Guest', GuestSchema);

export default Guest;
