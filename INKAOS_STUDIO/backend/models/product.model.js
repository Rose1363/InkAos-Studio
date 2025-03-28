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
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
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
productSchema.virtual('totalStock').get(function() {
  return this.variants.reduce((total, variant) => {
    return total + variant.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
  }, 0);
});

// Đảm bảo virtuals được bao gồm khi chuyển sang JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
// productSchema.index({ category: 1, subCategory: 1, design: 1 });
const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
