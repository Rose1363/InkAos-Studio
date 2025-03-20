import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide category name"],
      unique: true, 
      trim: true,
    },
    image: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;