import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cập nhật `updatedAt` trước khi lưu
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Xóa các Item khi xóa giỏ hàng
cartSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const itemIds = this.items.map((item) => item.itemId);
  await mongoose.model("Item").deleteMany({ _id: { $in: itemIds } });
  next();
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;