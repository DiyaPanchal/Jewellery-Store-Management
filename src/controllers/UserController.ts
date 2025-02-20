import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const secretKey = process.env.SECRET_KEY || "defaultSecretKey";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!["super_admin", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    if (role === "super_admin") {
      const existingSuperAdmin = await User.findOne({ role: "super_admin" });
      if (existingSuperAdmin) {
        res.status(400).json({ message: "Only one Super Admin allowed" });
        return;
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Only Super Admin can view users." });
      return;
    }

    const users = await User.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { username, email, role } = req.body;

    if (role && !["super_admin", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    if (role === "super_admin" && req.user?.role !== "super_admin") {
      res
        .status(403)
        .json({ message: "Only Super Admin can assign Super Admin role" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userToDelete.role === "super_admin") {
      res.status(403).json({ message: "Cannot delete the Super Admin" });
      return;
    }

    if (userToDelete.role === "admin" && req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Only Super Admin can delete Admins" });
      return;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
