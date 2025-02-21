import { Request, Response } from "express";
import Client from "../models/Client";
import Ledger from "../models/Ledger";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const createClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const {
      name,
      firmName,
      gstNumber,
      panNumber,
      phoneNumber,
      address,
      pincode,
      image,
    } = req.body;

    // if (
    //   !name ||
    //   !firmName ||
    //   !gstNumber ||
    //   !panNumber ||
    //   !phoneNumber ||
    //   !address ||
    //   !pincode ||
    //   !image
    // ) {
    //   res.status(400).json({ message: "All fields are required." });
    //   return;
    // }

    const existingGST = await Client.findOne({ gstNumber });
    if (existingGST) {
      res.status(400).json({ message: "GST number must be unique." });
      return;
    }

    const newClient = new Client({
      name,
      firmName,
      gstNumber,
      panNumber,
      phoneNumber,
      address,
      pincode,
      image,
    });
    await newClient.save();

    const newLedgerEntry = new Ledger({
      name,
      firmName,
      gstNumber,
      panNumber,
      phoneNumber,
      address,
      pincode,
      image,
    });
    await newLedgerEntry.save();

    res
      .status(201)
      .json({ message: "Client created successfully", client: newClient });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const getAllClients = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const clients = await Client.find();
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const { clientId } = req.params;
    const {
      name,
      firmName,
      gstNumber,
      panNumber,
      phoneNumber,
      address,
      pincode,
      image,
    } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        name,
        firmName,
        gstNumber,
        panNumber,
        phoneNumber,
        address,
        pincode,
        image,
      },
      { new: true }
    );

    if (!updatedClient) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Client updated successfully", updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ message: "Access Denied. Super Admin only." });
      return;
    }

    const { clientId } = req.params;
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    await Ledger.findOneAndDelete({ gstNumber: deletedClient.gstNumber });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
