import mongoose from "mongoose";

// interface IPurchaseOrder extends Document {
//   purchaseId: mongoose.Types.ObjectId;
//   category: string;
//   grossWeight: number;
//   netWeight: number;
//   stoneWeight: number;
//   rate: number;
//   amount: number;
// }

const purchaseOrderSchema = new mongoose.Schema({
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
    required: true,
  },
  category: { type: String, required: true },
  grossWeight: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  stoneWeight: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

purchaseOrderSchema.pre("save", function (next) {
  this.amount = (this.netWeight * this.rate) / 10;
  next();
});

export default mongoose.model(
  "PurchaseOrder",
  purchaseOrderSchema
);
