import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface ISettings extends Document {
    createdAt: Date;
    minBookingLength: number;
    maxBookingLength: number;
    maxGuestsPerBooking: number;
    breakfastPrice: number;
}

// Create a Schema corresponding to the document interface.
const SettingsSchema = new Schema<ISettings>({
    createdAt: { type: Date, default: Date.now },
    minBookingLength: { type: Number, required: true },
    maxBookingLength: { type: Number, required: true },
    breakfastPrice: { type: Number, required: true },
    maxGuestsPerBooking: { type: Number, required: true },
});

// Create a Model.
const Settings = model<ISettings>('Settings', SettingsSchema);

export default Settings;
