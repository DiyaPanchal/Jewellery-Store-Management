import mongoose from "mongoose";
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin";
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "admin"], required: true },
});

export default mongoose.model("User", UserSchema);
