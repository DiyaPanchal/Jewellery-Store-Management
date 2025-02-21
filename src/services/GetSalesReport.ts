import { Request, Response } from "express";
import Sale from "../models/Sales";
import { generateCSV, generatePDF } from "../utils/ReportUtility";

const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, format } = req.query;

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$clientId",
          clientName: { $first: "$clientName" },
          grossWeight: { $sum: "$grossWeight" },
          netWeight: { $sum: "$netWeight" },
          amount: { $sum: "$totalInvoiceAmount" },
        },
      },
    ])
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (format === "csv") {
      return generateCSV(res, sales, "sales_report.csv");
    } else if (format === "pdf") {
      return generatePDF(res, sales, "sales_report.hbs", "sales_report.pdf");
    }

    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: "Error generating sales report", error });
  }
};

export default getSalesReport;