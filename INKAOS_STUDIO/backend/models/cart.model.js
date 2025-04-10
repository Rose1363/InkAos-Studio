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
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: true,
        },
        size: { type: String, required: true },
        designId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Design",
          default: null,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Thêm chỉ mục cho items.itemId
cartSchema.index({ "items.itemId": 1 });

cartSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const itemIds = this.items.map((item) => item.itemId);
    const remainingItems = await mongoose.model("Cart").find({
      _id: { $ne: this._id },
      "items.itemId": { $in: itemIds },
    });
    if (remainingItems.length === 0) {
      await mongoose.model("Item").deleteMany({ _id: { $in: itemIds } });
    }
    next();
  } catch (error) {
    console.error("Error in pre-deleteOne middleware:", error);
    next(error);
  }
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;