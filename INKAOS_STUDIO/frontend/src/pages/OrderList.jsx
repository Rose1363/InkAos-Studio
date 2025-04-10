import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "react-hot-toast";
import NoData from "../components/UI/NoData";
import AxiosToastError from "../utils/AxiosToastError";
import { setOrder } from "../store/orderSlice";

const UpdateOrderStatus = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order);

  const statusOptions = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "packing", label: "Đang đóng gói" },
    { value: "shipping", label: "Đã giao" },
    { value: "cancelled", label: "Hủy" },
  ];

  const statusDisplayMap = {
    ...Object.fromEntries(statusOptions.map((opt) => [opt.value, opt.label])),
    delivered: "Hoàn tất",
  };

  const fetchOrders = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getDetailOrder });
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, orderStatus: newStatus },
      });

      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchOrders();
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipping":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Cập nhật trạng thái đơn hàng của khách hàng</p>
      </div>

      {orders.length === 0 ? (
        <NoData message="Không có đơn hàng nào" />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700">
            <div className="col-span-2">Mã đơn hàng</div>
            <div className="col-span-2">Ngày đặt</div>
            <div className="col-span-2">Khách hàng</div>
            <div className="col-span-2">Tổng tiền</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-2">Thao tác</div>
          </div>

          {orders.map((order) => (
            <div key={order._id} className="grid grid-cols-12 p-4 border-b items-center">
              <div className="col-span-2 font-medium text-blue-600">
                #{order.orderCode || order._id.slice(-6)}
              </div>
              <div className="col-span-2 text-gray-600">
                {formatDate(order.createdAt)}
              </div>
              <div className="col-span-2">
                {typeof order.userId === "object" && order.userId?.name
                  ? order.userId.name
                  : "Không xác định"}
              </div>
              <div className="col-span-2 font-medium">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {statusDisplayMap[order.orderStatus] || order.orderStatus}
                </span>
              </div>
              <div className="col-span-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={
                    order.orderStatus === "shipping" ||
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled"
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateOrderStatus;