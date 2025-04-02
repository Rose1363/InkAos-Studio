// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     productId : {
//         type : mongoose.Schema.ObjectId,
//         ref: 'Product'
//     },
//     quantity: {
//         type: Number,
//         default : 1
//     },
//     userId : {
//         type : mongoose.Schema.ObjectId,
//         ref: "User"
//     }
// },{
//     timestamps : true
// })

// const CartModel = mongoose.model('Car', cartSchema)
// export default CartModel

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: [true, "Variant is required"],
        },
        design: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Design",
          default: null, // null nếu là áo trơn (không có design)
        },
        size: {
          type: String,
          required: [true, "Size is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be a positive number"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual để tính tổng số lượng sản phẩm trong giỏ hàng
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Middleware để tự động tính totalPrice trước khi lưu
cartSchema.pre("save", async function (next) {
  const cart = this;
  let total = 0;

  // Populate thông tin từ items để tính giá
  for (let item of cart.items) {
    total += item.price * item.quantity;
  }

  cart.totalPrice = total;
  next();
});

// Index để tối ưu hóa truy vấn theo userId
cartSchema.index({ userId: 1 });

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;