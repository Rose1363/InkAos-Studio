import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide product name"],
      trim: true,
    },
    image: {
      type: [String],
      default: [],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    material: { type: String },
    basePrice: {
      type: Number,
      required: [true, "Provide product price"],
      min: [0, "Price must be a positive number"],
    },

    description: {
      type: String,
      trim: true,
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],

    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      default: null, // Cho phép null (áo trơn)
    },
    designPlacement: {
      // Vị trí in thiết kế
      x: { type: Number, default: 0.5 }, // Tọa độ X (0-1)
      y: { type: Number, default: 0.3 }, // Tọa độ Y (0-1)
      scale: { type: Number, default: 1.0 }, // Tỉ lệ
    },
  },
  {
    timestamps: true,
  }
);




// Index cho tìm kiếm
productSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 5 } }
);

// Index cho hiệu suất truy vấn
productSchema.index({ category: 1 });

// Middleware tự động xóa variants khi xóa product
productSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const productId = this.getQuery()._id; // Lấy _id từ truy vấn
  await mongoose.model("Variant").deleteMany({ product: productId });
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
