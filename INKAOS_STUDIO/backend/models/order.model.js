// models/Order.js
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    designId: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
    size: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "completed", "cancelled"], 
    default: "pending" 
  }
}, { timestamps: true });