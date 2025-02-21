import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  voucherDate: { type: Date, required: true },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  oppositeAccountName: { type: String, default: "Sales" },
  totalInvoiceAmount: { type: Number, required: true },
});

export default mongoose.model("Sales", saleSchema);
