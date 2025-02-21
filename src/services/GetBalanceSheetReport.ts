import { Request, Response } from "express";
import Sale from "../models/Sales";
import Purchase from "../models/Purchase";
import { generateCSV, generatePDF } from "../utils/ReportUtility";

const getBalanceSheetReport = async (req: Request, res: Response) => {
  try {
    const { format } = req.query;

    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: "$clientId",
          clientName: { $first: "$clientName" },
          credit: { $sum: "$totalAmount" },
          debit: { $sum: 0 },
        },
      },
    ]);

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$clientId",
          clientName: { $first: "$clientName" },
          debit: { $sum: "$totalInvoiceAmount" },
          credit: { $sum: 0 },
        },
      },
    ]);

    const balanceSheet = [...purchases, ...sales];

    if (format === "csv") {
      return generateCSV(res, balanceSheet, "balance_sheet.csv");
    } else if (format === "pdf") {
      return generatePDF(
        res,
        balanceSheet,
        "balance_sheet.hbs",
        "balance_sheet.pdf"
      );
    }

    res.status(200).json({ balanceSheet });
  } catch (error) {
    res.status(500).json({ message: "Error generating balance sheet", error });
  }
};

export default getBalanceSheetReport;