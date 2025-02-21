import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  voucherDate: { type: Date, required: true },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  oppositeAccountName: { type: String, default: "Purchase" },
  totalInvoiceAmount: { type: Number, required: true },
});


export default mongoose.model("Purchase", purchaseSchema);
