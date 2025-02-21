import mongoose from "mongoose";

// export interface ILedger extends Document {
//   name: string;
//   firmName: string;
//   gstNumber: string;
//   panNumber: string;
//   phoneNumber: string;
//   address: string;
//   pincode: string;
//   image: string;
// }

const LedgerSchema= new mongoose.Schema(
  {
    name: { type: String, required: true },
    firmName: { type: String, required: true },
    gstNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Ledger", LedgerSchema);
