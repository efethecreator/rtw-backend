import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Interview schema
export interface IInterviewVideos extends Document {
  interviewId: string;
  videos: IVideos[];
}

interface IVideos extends Document {
  userId: string;
  videoKey: string;
  pass: boolean;
  fail: boolean;
  note: string;
}

const videosSchema = new Schema<IVideos>({
  userId: {
    type: String,
    required: true,
  },
  videoKey: {
    type: String,
    required: true,
  },

  pass: {
    type: Boolean,
    required: true,
    default: false,
  },

  fail: {
    type: Boolean,
    required: true,
    default: false,
  },

  note: {
    type: String,
    required: false,
    default: "",
  },

});

// Mongoose schema for Interview
const InterviewVideosSchema: Schema = new Schema<IInterviewVideos>(
  {
    interviewId: {
      type: String,
      required: true,
    },
    videos: { type: [videosSchema], required: true, default: [] },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose model for Interview
const InterviewVideos = mongoose.model<IInterviewVideos>(
  "InterviewVideos",
  InterviewVideosSchema
);

export default InterviewVideos;
