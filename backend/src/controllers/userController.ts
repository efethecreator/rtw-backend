import { Request, Response } from "express";
import { createUser } from "../services/userService";
import { IUserInput } from "../models/userModel"; // Import new interface
import { findUserById } from "../services/userService"; // Import findUserById function

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, surname, email, phone, videoUrl, status, note } = req.body;

    // Constructing user data with IUserInput type
    const userData: IUserInput = {
      name,
      surname,
      email,
      phone,
      videoUrl,
      status,
      note,
    };

    // Create user by calling service
    const newUser = await createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

// Yeni kullanıcıyı ID'ye göre getiren kontrolcü
export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};
