import mongoose from "mongoose";

const saleOrderSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true },
  category: { type: String, required: true },
  grossWeight: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  stoneWeight: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }, 
});

export default mongoose.model("SaleOrder", saleOrderSchema);
