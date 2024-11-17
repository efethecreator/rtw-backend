import Interview, { IInterview } from '../models/interviewModel'; // Importing Interview model

// Create a new interview
export const createInterview = async (data: Partial<IInterview>): Promise<IInterview> => {
  const interviewData = {
    ...data,
    users: [] // Empty users array
  };

  const interview = new Interview(interviewData);
  return await interview.save(); // Save the interview to the database
};

// Get a single interview by ID
export const getInterviewById = async (id: string): Promise<IInterview | null> => {
  return await Interview.findById(id).populate('packages').populate('users');
};

// Get all interviews
export const getAllInterviews = async (): Promise<IInterview[]> => {
  return await Interview.find().populate('packages').populate('users');
};

// Delete interview by ID
export const deleteInterviewById = async (id: string): Promise<IInterview | null> => {
  return await Interview.findByIdAndDelete(id);
};