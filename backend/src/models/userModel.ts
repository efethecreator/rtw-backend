import { Schema, model, Document } from 'mongoose';

// User interface to enforce TypeScript types
// User input data without Mongoose methods
export interface IUserInput {
  name: string;
  surname: string;
  email: string;
  phone: string;
  videoUrl?: string;  // Optional
  status?: string;    // Optional, with default 'pending'
  note?: string;      // Optional
}


// User schema definition
const userSchema = new Schema<IUserInput>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: false // optional field
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'], // example status options
    default: 'pending'
  },
  note: {
    type: String,
    required: false, // optional field
    trim: true
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

// Create the user model
const User = model<IUserInput>('User', userSchema);

export default User;
