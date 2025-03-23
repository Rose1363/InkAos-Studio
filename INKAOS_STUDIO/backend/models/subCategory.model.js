import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide category name"],
      unique: true, 
      trim: true,
    },
    category: {
         type: mongoose.Schema.ObjectId,
         ref: "Category", 
        
       },
  },
  {
    timestamps: true, 
  }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default SubCategoryModel;