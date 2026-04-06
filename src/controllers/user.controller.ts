import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  loginUser,
} from "../services/user.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(name, email, password, role);

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await loginUser(email, password);

    res.status(200).json({ message: "Login Succesfull", token });
  } catch (error) {
    res.status(401).json({ message: "Internal server error" });
  }
};
