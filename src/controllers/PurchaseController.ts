import { Request, Response } from "express";
// import { Purchase, PurchaseOrder } from "../models/purchase";
import Purchase from "../models/Purchase";
import PurchaseOrder from "../models/PurchaseOrder";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { voucherDate, clientId, orders } = req.body as {
      voucherDate: Date;
      clientId: string;
      orders: {
        category: string;
        grossWeight: number;
        netWeight: number;
        stoneWeight: number;
        rate: number;
      }[];
    };

    let totalInvoiceAmount = 0;

    const purchaseOrders = orders.map((order) => {
      const amount = (order.netWeight * order.rate) / 10;
      totalInvoiceAmount += amount;
      return { ...order, amount };
    });

    const newPurchase = await Purchase.create({
      voucherDate,
      clientId,
      oppositeAccountName: "Purchase",
      totalInvoiceAmount,
    });

    const purchaseOrderDocs = purchaseOrders.map((order) => ({
      ...order,
      purchaseId: newPurchase._id,
    }));

    await PurchaseOrder.insertMany(purchaseOrderDocs);

    res.status(201).json({
      message: "Purchase created successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase", error });
  }
};


export const getPurchases = async (req: Request, res: Response) => {
  try {
    const { clientId, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;
    if (dateFrom && dateTo)
      filter.voucherDate = {
        $gte: new Date(dateFrom as string),
        $lte: new Date(dateTo as string),
      };

    const purchases = await Purchase.find(filter)
      .sort({ voucherDate: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchases", error });
  }
};

export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchase = await Purchase.findById(req.params.purchaseId);
    
    if (!purchase) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }

    const purchaseOrders = await PurchaseOrder.find({ purchaseId: purchase._id });

    res.status(200).json({ purchase, purchaseOrders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchase", error });
  }
};