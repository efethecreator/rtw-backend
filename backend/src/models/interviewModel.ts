import mongoose, { Schema, Document, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface Question {
  question: string;
  time: number;
}

// Interface for Interview schema
export interface IInterview extends Document {
  title: string;
  packages: packages[]; // Referencing QuestionPackage
  questions: Question[]; // Assuming questions are strings
  expireDate: Date;
  canSkip: boolean;
  totalVideos: number;
  pendingVideos: number;
  showAtOnce: boolean;
  interviewLink?: string; // Optional field
  users: Types.ObjectId[]; // Referencing Users
}

interface packages extends Document {
  packageId: string;
}

const packagesSchema = new Schema<packages>({
  packageId: {
    type: String,
    required: true,
  },
});

// Mongoose schema for Interview
const InterviewSchema: Schema = new Schema<IInterview>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    packages: { type: [packagesSchema], required: true, default: [] },
    questions: {
      type: [
        {
          question: {
            type: String,
            required: false,
          },
          time: {
            type: Number,
            required: false,
          },
        },
      ],
      required: false,
      default: [],
    },
    expireDate: {
      type: Date,
      required: true,
    },
    canSkip: {
      type: Boolean,
      required: true,
      default: false,
    },
    showAtOnce: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalVideos: {
      type: Number,
      required: false,
      default: 0,
    },
    pendingVideos: {
      type: Number,
      required: false,
      default: 0,
    },
    interviewLink: {
      type: String,
      default: () => uuidv4(), // Automatically generates a UUID for the interview link
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: false,
        default: [], // Initially empty array for users
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose model for Interview
const Interview = mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
