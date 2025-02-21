import mongoose from "mongoose";

const RateMasterSchema = new mongoose.Schema(
  {
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("RateMaster", RateMasterSchema);
