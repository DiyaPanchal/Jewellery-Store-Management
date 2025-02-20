import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Gold", "Silver"], required: true },
  code: { type: String, required: true, unique: true },
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
