import { Request, Response } from "express";
import RateMaster from "../models/Rate";

export const getRate = async (req: Request, res: Response): Promise<any> => {
  try {
    const rate = await RateMaster.findOne();
    if (!rate) return res.status(404).json({ message: "Rate not found" });

    res.status(200).json(rate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rate", error });
  }
};

export const upsertRate = async (req: Request, res: Response) => {
  try {
    const { rate } = req.body;
    await RateMaster.deleteMany({});

    const newRate = new RateMaster({ rate });
    await newRate.save();

    res
      .status(201)
      .json({ message: "Rate updated successfully", rate: newRate });
  } catch (error) {
    res.status(500).json({ message: "Error updating rate", error });
  }
};

export const deleteRate = async (req: Request, res: Response) => {
  try {
    await RateMaster.deleteMany({});
    res.status(200).json({ message: "Rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rate", error });
  }
};
