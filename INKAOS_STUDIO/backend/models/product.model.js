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
    // subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
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



// Trong product.model.js
productSchema.virtual("totalStock").get(function () {
  if (!this.populated("variants")) {
    return 0;
  }

  return this.variants.reduce((total, variant) => {
    if (!variant || !Array.isArray(variant.sizes)) return total;
    return (
      total +
      variant.sizes.reduce((sum, size) => sum + (size.stock || 0), 0)
    );
  }, 0);
});

// Index cho tìm kiếm
productSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 5 } }
);

// Index cho hiệu suất truy vấn
productSchema.index({ category: 1 });

// Middleware tự động xóa variants khi xóa product
productSchema.pre("remove", async function (next) {
  await mongoose.model("Variant").deleteMany({ product: this._id });
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
