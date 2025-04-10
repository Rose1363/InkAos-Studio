import OrderModel from "../models/order.model.js";
import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(timezone);
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import { VnpLocale } from "vnpay";
import { VNPay, ProductCode } from "vnpay";
export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { addressId, selectedItems } = request.body;

    if (!addressId || !selectedItems || selectedItems.length === 0) {
      return response.status(400).json({
        message: "Thiếu địa chỉ hoặc không có sản phẩm nào được chọn",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "Không tìm thấy người dùng",
        error: true,
        success: false,
      });
    }

    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return response.status(404).json({
        message: "Không tìm thấy địa chỉ",
        error: true,
        success: false,
      });
    }

    const orderItems = selectedItems.map((item) => ({
      itemId: item.itemId._id,
      productId: item.itemId.productId,
      variantId: item.itemId.variantId,
      size: item.size,
      designId: item.itemId.designId || null,
      quantity: item.quantity,
      price: item.itemId.totalPrice,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new OrderModel({
      userId,
      address: {
        name: address.name,
        phoneNumber: address.phoneNumber,
        address: address.address,
        isDefault: address.isDefault,
      },
      items: orderItems,
      totalAmount,
      paymentMethod: "cod",
      paymentStatus: "pending",
      shippingFee: 0,
      invoice_receipt: "",
    });

    const savedOrder = await order.save();

    // Xóa các mục đã đặt khỏi giỏ hàng dựa trên logic kiểm tra
    const itemsToRemove = selectedItems.map((item) => ({
      productId: item.itemId.productId,
      variantId: item.itemId.variantId,
      size: item.size,
      designId: item.itemId.designId || null,
    }));

    await CartModel.updateOne(
      { userId },
      {
        $pull: {
          items: {
            $or: itemsToRemove.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              size: item.size,
              designId: item.designId, // Nếu designId là null, sẽ khớp với các mục không có designId
            })),
          },
        },
      }
    );

    return response.status(201).json({
      message: "Đơn hàng COD đã được tạo thành công",
      error: false,
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
}
export async function getOrderDetailsController(request, response) {
  try {
    // Không lọc theo userId để lấy toàn bộ đơn hàng
    const orderlist = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate("address")
      .populate("userId", "name email"); // Tùy chọn: Populate thông tin user

    return response.json({
      message: "Danh sách tất cả đơn hàng",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Có lỗi xảy ra",
      error: true,
      success: false,
    });
  }
}
export async function getOrdersByUserId(req, res) {
  const userId = req.userId;

  try {
    const orders = (
      await OrderModel.find({ userId })
        .sort({ createdAt: -1 })
        .populate([
          { path: "items.itemId" },
          { path: "items.productId" },
          { path: "items.designId" },
        ])
    ).map((order) => {
      const flatItems = order.items.map((item) => ({
        ...{ quantity: item._doc.quantity, price: item._doc.price },
        ...item.itemId?._doc,
        ...item.productId?._doc,
        ...item.designId?._doc,
      }));

      return {
        ...order._doc,
        items: flatItems,
      };
    });
    if (orders === undefined || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }
    res.json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy đơn hàng", error });
  }
}
export async function updateOrderStatusController(request, response) {
  try {
    const { orderId, orderStatus, cancelReason } = request.body;

    if (!orderId || !orderStatus) {
      return response.status(400).json({
        message: "Thiếu orderId hoặc orderStatus",
        error: true,
        success: false,
      });
    }

    const validStatusesForAdmin = ["pending", "confirmed", "packing", "shipping", "cancelled"];
    if (!validStatusesForAdmin.includes(orderStatus)) {
      return response.status(400).json({
        message: "Trạng thái không hợp lệ cho admin",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return response.status(404).json({
        message: "Không tìm thấy đơn hàng",
        error: true,
        success: false,
      });
    }

    if (
      (order.orderStatus === "shipping" || order.orderStatus === "delivered") &&
      orderStatus === "cancelled"
    ) {
      return response.status(400).json({
        message: "Không thể hủy đơn hàng đã giao hoặc hoàn tất",
        error: true,
        success: false,
      });
    }

    if (orderStatus === "shipping" && order.orderStatus !== "shipping") {
      order.shippedAt = new Date();
    }

    if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
      order.cancelReason = cancelReason || "Hủy bởi admin"; // Mặc định nếu không cung cấp lý do
      order.cancelledBy = "admin";
    }

    order.orderStatus = orderStatus;
    await order.save();

    return response.status(200).json({
      message: "Cập nhật trạng thái thành công",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
}
export async function cancelOrderController(request, response) {
  try {
    const userId = request.userId;
    const { orderId, cancelReason } = request.body;

    if (!orderId || !cancelReason) {
      return response.status(400).json({
        message: "Thiếu orderId hoặc cancelReason",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return response.status(404).json({
        message: "Không tìm thấy đơn hàng",
        error: true,
        success: false,
      });
    }

    if (order.orderStatus !== "pending") {
      return response.status(400).json({
        message: "Chỉ có thể hủy đơn hàng ở trạng thái 'Chờ xác nhận'",
        error: true,
        success: false,
      });
    }

    order.orderStatus = "cancelled";
    order.cancelReason = cancelReason;
    order.cancelledBy = "user";
    await order.save();

    return response.status(200).json({
      message: "Hủy đơn hàng thành công",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
}
export async function confirmOrderReceivedController(request, response) {
  try {
    const userId = request.userId;
    const { orderId } = request.body;

    if (!orderId) {
      return response.status(400).json({
        message: "Thiếu orderId",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return response.status(404).json({
        message: "Không tìm thấy đơn hàng",
        error: true,
        success: false,
      });
    }

    if (order.orderStatus !== "shipping") {
      return response.status(400).json({
        message: "Đơn hàng chưa ở trạng thái 'Đã giao' để xác nhận",
        error: true,
        success: false,
      });
    }

    order.orderStatus = "delivered";
    await order.save();

    return response.status(200).json({
      message: "Xác nhận nhận hàng thành công",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
}
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE, 
  secureSecret: process.env.VNPAY_SECURE_SECRET, 
  vnpayHost: "https://sandbox.vnpayment.vn", 
});

export async function VnpayOrderController(request, response) {
  try {
    const userId = request.userId;
    const { addressId, selectedItems } = request.body;

    if (!addressId || !selectedItems || selectedItems.length === 0) {
      return response.status(400).json({
        message: "Thiếu địa chỉ hoặc không có sản phẩm nào được chọn",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "Không tìm thấy người dùng",
        error: true,
        success: false,
      });
    }

    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return response.status(404).json({
        message: "Không tìm thấy địa chỉ",
        error: true,
        success: false,
      });
    }

    const orderItems = selectedItems.map((item) => ({
      itemId: item.itemId._id,
      productId: item.itemId.productId,
      variantId: item.itemId.variantId,
      size: item.size,
      designId: item.itemId.designId || null,
      quantity: item.quantity,
      price: item.itemId.totalPrice,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new OrderModel({
      userId,
      address: {
        name: address.name,
        phoneNumber: address.phoneNumber,
        address: address.address,
        isDefault: address.isDefault,
      },
      items: orderItems,
      totalAmount,
      paymentMethod: "vnpay",
      paymentStatus: "pending",
      shippingFee: 0,
      invoice_receipt: "",
      orderCode: Date.now().toString(),
    });

    const savedOrder = await order.save();

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalAmount, 
      vnp_IpAddr:
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.ip ||
        "127.0.0.1",
      vnp_TxnRef: savedOrder.orderCode, 
      vnp_OrderInfo: `Thanh toan don hang ${savedOrder.orderCode}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:8080/api/order/vnpay/return", 
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dayjs().format("YYYYMMDDHHmmss"),
    });

    return response.status(201).json({
      success: true,
      message: "Đơn hàng đã được tạo thành công",
      data: {
        order: savedOrder,
        paymentUrl: paymentUrl,
      },
    });
  } catch (error) {
    console.error("Lỗi trong VnpayOrderController:", error.message);
    return response.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
}


export async function VnpayReturnController(request, response) {
  try {
    const vnpParams = request.query;
    console.log("VNPay return params:", vnpParams);
    console.log("VNPay Response Code:", vnpParams.vnp_ResponseCode);

    const verify = vnpay.verifyReturnUrl(vnpParams);
    console.log("Verify result:", verify);

    if (!verify.isVerified) {
      console.log("Verification failed");
      return response.redirect(`${process.env.FRONTEND_URL}/cancel`);
    }

    const order = await OrderModel.findOne({ orderCode: vnpParams.vnp_TxnRef });
    if (!order) {
      console.log("Order not found for TxnRef:", vnpParams.vnp_TxnRef);
      return response.redirect(`${process.env.FRONTEND_URL}/cancel`);
    }

    // Lưu chi tiết phản hồi từ VNPay
    order.vnpayResponse = vnpParams;

    if (vnpParams.vnp_ResponseCode === "00") {
      order.paymentStatus = "completed";
      order.orderStatus = "confirmed";
      order.invoice_receipt = vnpParams.vnp_TransactionNo;
      await order.save();

      // Xóa các mục đã đặt khỏi giỏ hàng
      const itemsToRemove = order.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        designId: item.designId || null,
      }));

      await CartModel.updateOne(
        { userId: order.userId },
        {
          $pull: {
            items: {
              $or: itemsToRemove.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                size: item.size,
                designId: item.designId,
              })),
            },
          },
        }
      );

      console.log("Payment successful, updated order status and cleared cart items");
      return response.redirect(`${process.env.FRONTEND_URL}/success?orderCode=${vnpParams.vnp_TxnRef}`);
    } else {
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.cancelReason = `Thanh toán VNPay thất bại (ResponseCode: ${vnpParams.vnp_ResponseCode})`;
      order.cancelledBy = "system";
      await order.save();
      console.log("Payment failed or cancelled. Response code:", vnpParams.vnp_ResponseCode);
      return response.redirect(`${process.env.FRONTEND_URL}/cancel?orderCode=${vnpParams.vnp_TxnRef}`);
    }
  } catch (error) {
    console.error("Error in VnpayReturnController:", error.message, error.stack);
    return response.redirect(`${process.env.FRONTEND_URL}/cancel`);
  }
}
export async function VnpayIpnController(request, response) {
  try {
    const vnpParams = request.query;
    console.log("VNPay IPN params:", vnpParams);
    const verify = vnpay.verifyIpnCall(vnpParams);

    if (!verify.isVerified) {
      return response.json({
        RspCode: "97",
        Message: "Checksum failed",
      });
    }

    const order = await OrderModel.findOne({ orderCode: vnpParams.vnp_TxnRef });
    if (!order) {
      return response.json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    if (order.paymentStatus === "completed") {
      return response.json({
        RspCode: "02",
        Message: "Order already confirmed",
      });
    }

    // Lưu chi tiết phản hồi từ VNPay
    order.vnpayResponse = vnpParams;

    if (verify.isSuccess) {
      order.paymentStatus = "completed";
      order.orderStatus = "confirmed";
      order.invoice_receipt = vnpParams.vnp_TransactionNo;
      await order.save();

      // Xóa các mục đã đặt khỏi giỏ hàng
      const itemsToRemove = order.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        designId: item.designId || null,
      }));

      await CartModel.updateOne(
        { userId: order.userId },
        {
          $pull: {
            items: {
              $or: itemsToRemove.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                size: item.size,
                designId: item.designId,
              })),
            },
          },
        }
      );

      return response.json({
        RspCode: "00",
        Message: "Success",
      });
    } else {
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.cancelReason = `Thanh toán VNPay thất bại (ResponseCode: ${vnpParams.vnp_ResponseCode})`;
      order.cancelledBy = "system";
      await order.save();
      return response.json({
        RspCode: "10",
        Message: `Transaction failed or cancelled (ResponseCode: ${vnpParams.vnp_ResponseCode})`,
      });
    }
  } catch (error) {
    console.error("Lỗi trong VnpayIpnController:", error.message, error.stack);
    return response.json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
}