import { Request, Response } from "express";
import Category from "../models/Category";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const createCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const { name, type, code } = req.body;

    if (!name || !type || !code) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const existingCategory = await Category.findOne({ code });
    if (existingCategory) {
      res.status(400).json({ message: "Category code must be unique." });
      return;
    }

    const category = new Category({ name, type, code });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};

export const getAllCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const categories = await Category.find();
    res.status(200).json({ categories });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const { categoryId } = req.params;
    const { name, type, code } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, type, code },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};


export const deleteCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};
