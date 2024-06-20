import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    numNights: number;
    numGuests: number;
    cabinPrice: number;
    extrasPrice: number;
    totalPrice: number;
    status: string;
    hasBreakfast: boolean;
    isPaid: boolean;
    observations: string;
    cabinId: Schema.Types.ObjectId;
    guestId: Schema.Types.ObjectId;
}

const BookingSchema = new Schema<IBooking>({
    createdAt: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numNights: { type: Number, required: true },
    numGuests: { type: Number, required: true },
    cabinPrice: { type: Number, required: true },
    extrasPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, enum: ['unconfirmed', 'confirmed', 'cancelled'], default: 'unconfirmed' },
    hasBreakfast: { type: Boolean, required: true },
    isPaid: { type: Boolean, required: true },
    observations: { type: String },
    cabinId: { type: Schema.Types.ObjectId, ref: 'Cabin', required: true },
    guestId: { type: Schema.Types.ObjectId, ref: 'Guest', required: true },
});
// Create an index on cabinId and startDate
BookingSchema.index({ cabinId: 1, startDate: 1 });

// Pre-save hook to check for overlapping bookings
BookingSchema.pre('save', async function (next) {
    const booking = this as IBooking;

    // Find overlapping bookings for the same cabin
    const overlappingBookings = await Booking.find({
        cabinId: booking.cabinId,
        $or: [
            {
                startDate: { $lt: booking.endDate },
                endDate: { $gt: booking.startDate },
            },
        ],
    });

    if (overlappingBookings.length > 0) {
        const error = new Error('This cabin is already booked for the selected dates.');
        next(error);
    } else {
        next();
    }
});

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
