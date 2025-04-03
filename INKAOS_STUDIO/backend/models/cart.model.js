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

cartSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const itemIds = this.items.map((item) => item.itemId);
  await mongoose.model("Cart").updateMany(
    { "items.itemId": { $in: itemIds } },
    { $pull: { items: { itemId: { $in: itemIds } } } }
  );
  const remainingItems = await mongoose.model("Cart").find({ "items.itemId": { $in: itemIds } });
  if (remainingItems.length === 0) {
    await mongoose.model("Item").deleteMany({ _id: { $in: itemIds } });
  }
  next();
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;