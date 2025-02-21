import mongoose from "mongoose";

// export interface IClient extends Document {
//   name: string;
//   firmName: string;
//   gstNumber: string;
//   panNumber: string;
//   phoneNumber: string;
//   address: string;
//   pincode: string;
//   image: string;
// }

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    firmName: { type: String, required: true, trim: true },
    gstNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9A-Z]{15}$/,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    address: { type: String, required: true },
    pincode: { type: String, required: true, match: /^[1-9][0-9]{5}$/ },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
