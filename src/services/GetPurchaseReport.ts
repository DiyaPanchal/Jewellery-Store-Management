import { Request, Response } from "express";
import Purchase from "../models/Purchase";
import { generateCSV, generatePDF } from "../utils/ReportUtility";

const getPurchaseReport = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, format } = req.query;

    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: "$clientId",
          clientName: { $first: "$clientName" },
          grossWeight: { $sum: "$grossWeight" },
          netWeight: { $sum: "$netWeight" },
          amount: { $sum: "$totalAmount" },
        },
      },
    ])
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (format === "csv") {
      return generateCSV(res, purchases, "purchase_report.csv");
    } else if (format === "pdf") {
      return generatePDF(
        res,
        purchases,
        "purchase_report.hbs",
        "purchase_report.pdf"
      );
    }

    res.status(200).json({ purchases });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating purchase report", error });
  }
};

export default getPurchaseReport;