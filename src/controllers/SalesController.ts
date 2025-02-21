import { Request, Response } from "express";
import Sale from "../models/Sales";
import SaleOrder from "../models/SalesOrder";

interface Order {
  category: string;
  grossWeight: number;
  netWeight: number;
  stoneWeight: number;
  rate: number;
  amount?: number;
}

export const createSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      voucherDate,
      clientId,
      orders,
    }: { voucherDate: string; clientId: string; orders: Order[] } = req.body;

    let totalInvoiceAmount = 0;
    const saleOrders = orders.map((order: Order) => {
      const amount = (order.netWeight * order.rate) / 10;
      totalInvoiceAmount += amount;
      return { ...order, amount };
    });

    const newSale = await Sale.create({
      voucherDate,
      clientId,
      oppositeAccountName: "Sales",
      totalInvoiceAmount,
    });

    const saleOrderDocs = saleOrders.map((order) => ({
      ...order,
      saleId: newSale._id,
    }));

    await SaleOrder.insertMany(saleOrderDocs);

    res
      .status(201)
      .json({ message: "Sale created successfully", sale: newSale });
  } catch (error) {
    res.status(500).json({ message: "Error creating sale", error });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const { clientId, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;
    if (dateFrom && dateTo)
      filter.voucherDate = {
        $gte: new Date(dateFrom as string),
        $lte: new Date(dateTo as string),
      };

    const sales = await Sale.find(filter)
      .sort({ voucherDate: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

export const getSaleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const saleOrders = await SaleOrder.find({ saleId: sale._id });

    res.status(200).json({ sale, saleOrders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error });
  }
};
