import User, { IUserInput } from "../models/userModel";

export const createUser = async (userData: IUserInput): Promise<IUserInput> => {
  const user = new User(userData);
  return await user.save();
};

export const findUserById = async (userId: string) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};
