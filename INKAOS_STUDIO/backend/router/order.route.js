import express from "express";
import { cancelOrderController, CashOnDeliveryOrderController, confirmOrderReceivedController, getOrderDetailsController, getOrdersByUserId, updateOrderStatusController, VnpayIpnController, VnpayOrderController, VnpayReturnController } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.get("/get",auth,getOrderDetailsController)
orderRouter.patch("/update-status",auth,updateOrderStatusController)
orderRouter.post("/get-by-user",auth,getOrdersByUserId)
orderRouter.post('/confirm-received', auth, confirmOrderReceivedController)
orderRouter.post('/vnpay',auth, VnpayOrderController)
orderRouter.post('/cancel-by-user',auth, cancelOrderController)
orderRouter.get('/vnpay/return', VnpayReturnController)
orderRouter.get('/vnpay/ipn',auth, VnpayIpnController)
export default orderRouter;