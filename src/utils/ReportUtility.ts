import { Response } from "express";
import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import pdf from "html-pdf";
import hbs from "handlebars";

export const generateCSV = async (
  res: Response,
  data: any[],
  filename: string
) => {
  const writer = createObjectCsvWriter({
    path: filename,
    header: Object.keys(data[0] || {}).map((key) => ({ id: key, title: key })),
  });

  await writer.writeRecords(data);
  res.download(filename, () => fs.unlinkSync(filename));
};

export const generatePDF = async (
  res: Response,
  data: any[],
  templateFile: string,
  filename: string
) => {
  const templatePath = path.join(__dirname, "../templates", templateFile);
  const templateHtml = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = hbs.compile(templateHtml);
  const html = compiledTemplate({ data });

  pdf.create(html).toFile(filename, (err, _) => {
    if (err)
      return res.status(500).json({ message: "Error generating PDF", err });
    res.download(filename, () => fs.unlinkSync(filename));
  });
};
