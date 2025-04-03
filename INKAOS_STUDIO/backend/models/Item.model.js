import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String },
    productBasePrice: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true, // Thêm index để hỗ trợ lọc theo danh mục
    },

    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: false,
    },
    designImage : { type: String },
    designName: { type: String },
    designBasePrice: { type: Number },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },
    color: { type: String, required: true },
    colorCode: {
      type: String, 
      required: true,
      default: "#000000" 
    },
    size: { type: String, required: true },
    variantPrice: { type: Number, required: true },

    totalPrice: { type: Number, required: true }, // Tổng giá của mục
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Thêm index để hỗ trợ truy vấn theo người tạo
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true, // Thêm index để hỗ trợ lọc các Item công khai
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.pre("save", function (next) {
  this.totalPrice = (this.productBasePrice || 0) + (this.designBasePrice || 0) + this.variantPrice;
  next();
});

itemSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const item = await this.model.findOne(this.getQuery());
  if (!item) return next();
  await mongoose.model("Cart").updateMany(
    { "items.itemId": item._id },
    { $pull: { items: { itemId: item._id } } }
  );
  next();
});

const ItemModel = mongoose.model("Item", itemSchema);
export default ItemModel;