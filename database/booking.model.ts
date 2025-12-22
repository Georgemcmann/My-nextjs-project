import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Event } from "./event.model";

/**
 * Booking document interface
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook
 * - Ensures the referenced Event exists
 */
BookingSchema.pre<IBooking>("save", async function () {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist");
  }
});

export const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
