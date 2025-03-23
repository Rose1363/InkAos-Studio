import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide product name"],
      trim: true,
    },
    image: {
      type: [],
      default: []
    },

    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory", // Tham chiếu đến Category
    },
    price: {
      type: Number,
      required: [true, "Provide product price"],
      min: [0, "Price must be a positive number"],
    },
    discount: {
        type: Number,
        defaullt: null
    },
    stock: {
      type: Number,
      required: [true, "Provide stock quantity"],
      min: [0, "Stock must be a non-negative number"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware để kiểm tra category_id có tồn tại trước khi lưu Product
// productSchema.pre("save", async function (next) {
//   const product = this;
//   const category = await mongoose.model("Category").findById(product.category_id);
//   if (!category) {
//     throw new Error("Category not found");
//   }
//   next();
// });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;