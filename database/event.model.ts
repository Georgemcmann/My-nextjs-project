import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Event document interface
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Converts a string into a URL-safe slug
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook
 * - Generates slug only if title changes
 * - Normalizes date to ISO format
 * - Enforces HH:mm time format
 * - Ensures required string fields are non-empty
 */
EventSchema.pre<IEvent>("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  const parsedDate = new Date(this.date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }
  this.date = parsedDate.toISOString();

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(this.time)) {
    throw new Error("Time must be in HH:mm format");
  }

  const requiredFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredFields) {
    if (!this[field] || String(this[field]).trim() === "") {
      throw new Error(`Field "${field}" cannot be empty`);
    }
  }
});

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;