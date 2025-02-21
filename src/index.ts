import express from "express";
import "dotenv/config";
import apiRouter from "./routes/api";
import connectDB from "./config/db";
import "./utils/RateCron";

const port = process.env.PORT || 3002;
const app = express();

app.use("/", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

connectDB();