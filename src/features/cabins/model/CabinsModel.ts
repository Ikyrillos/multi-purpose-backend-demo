import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface ICabin extends Document {
    createdAt: Date;
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: string;
}

// Create a Schema corresponding to the document interface.
const CabinSchema = new Schema<ICabin>({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
});

// Create a Model.
const Cabin = model<ICabin>('Cabin', CabinSchema);

export default Cabin;
