import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    address: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
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
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "packing", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    orderCode: {
      type: String,
      unique: true,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
    vnpayTransactionId: { type: String, default: "" },
    vnpayResponse: { type: Object, default: {} },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    cancelReason: { type: String, default: "" }, // Lý do hủy
    cancelledBy: { type: String, enum: ["user", "admin"], default: null }, // Ai hủy
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    this.orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;