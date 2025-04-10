import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const user = useSelector((state) => state.user);

  const statusOptions = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "packing", label: "Đang đóng gói" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const cancelReasons = [
    "Sai địa chỉ giao hàng",
    "Thay đổi ý định",
    "Sản phẩm không còn nhu cầu",
    "Khác",
  ];

  // Các hàm xử lý logic giữ nguyên như cũ
  const fetchOrders = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrder,
        data: { userId: user._id },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError("Không tìm thấy đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      const response = await Axios({
        ...SummaryApi.confirmOrderReceived,
        data: { orderId },
      });

      if (response.data.success) {
        toast.success("Xác nhận nhận hàng thành công");
        fetchOrders();
      } else {
        toast.error(response.data.message || "Lỗi khi xác nhận nhận hàng");
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      toast.error("Lỗi khi xác nhận nhận hàng");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Vui lòng chọn lý do hủy");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.cancelOrderByUser,
        data: { orderId: cancelOrderId, cancelReason },
      });

      if (response.data.success) {
        toast.success("Hủy đơn hàng thành công");
        fetchOrders();
        setShowCancelModal(false);
        setCancelReason("");
        setCancelOrderId(null);
      } else {
        toast.error(response.data.message || "Lỗi khi hủy đơn hàng");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Lỗi khi hủy đơn hàng");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setCancelOrderId(null);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchOrders();
  }, [user._id]);

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleString("vi-VN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Chưa có";
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý các đơn hàng của bạn</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-gray-600 mb-6">Hãy bắt đầu mua sắm ngay bây giờ!</p>
          <a
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
          >
            Mua sắm ngay
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5 flex flex-wrap justify-between items-center border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Đơn hàng #{order.orderCode || order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {statusOptions.find((s) => s.value === order.orderStatus)?.label || order.orderStatus}
                  </span>
                  <span className="text-base font-bold text-gray-800">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.designImage || item.productImage || "/placeholder-product.jpg"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">
                        {item.productName}
                        {item.designName && ` - ${item.designName}`}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {item.size} • Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {order.items.length > 2 && (
                  <div className="text-center text-sm text-gray-500">
                    + {order.items.length - 2} sản phẩm khác
                  </div>
                )}
              </div>
              
              <div className="p-5 bg-gray-50 flex flex-wrap justify-between items-center">
                <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                  <span className="font-medium">Thanh toán:</span> {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "VNPay"}
                </p>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {order.orderStatus === "pending" && (
                    <button
                      onClick={() => openCancelModal(order._id)}
                      className="px-4 py-2 text-sm bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy đơn
                    </button>
                  )}
                  {order.orderStatus === "shipping" && (
                    <button
                      onClick={() => handleConfirmReceived(order._id)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đã nhận hàng
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 flex-grow sm:flex-grow-0 justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn hàng #{selectedOrder.orderCode || selectedOrder._id.slice(-6).toUpperCase()}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin đơn hàng */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Thông tin đơn hàng</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p>
                      <span className="font-medium">Trạng thái:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {statusOptions.find((s) => s.value === selectedOrder.orderStatus)?.label || selectedOrder.orderStatus}
                      </span>
                    </p>
                    {selectedOrder.shippedAt && <p><span className="font-medium">Ngày giao:</span> {formatDate(selectedOrder.shippedAt)}</p>}
                    {selectedOrder.deliveredAt && <p><span className="font-medium">Ngày hoàn tất:</span> {formatDate(selectedOrder.deliveredAt)}</p>}
                    {selectedOrder.orderStatus === "cancelled" && (
                      <>
                        <p className="text-red-600"><span className="font-medium">Lý do hủy:</span> {selectedOrder.cancelReason || "Không có lý do"}</p>
                        <p><span className="font-medium">Hủy bởi:</span> {selectedOrder.cancelledBy === "user" ? "Khách hàng" : "Admin"}</p>
                      </>
                    )}
                    <p className="font-medium text-lg mt-3">Tổng tiền: {formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Địa chỉ giao hàng</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Tên:</span> {selectedOrder.address?.name || "Không xác định"}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedOrder.address?.phoneNumber || "N/A"}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {selectedOrder.address?.address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Sản phẩm */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Sản phẩm ({selectedOrder.items.length})</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-start border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.designImage || item.productImage || "/placeholder-product.jpg"}
                          alt={item.productName || "Sản phẩm"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium text-gray-800">
                          {item.productName || "Sản phẩm không xác định"}
                          {item.designName && <span className="text-gray-600"> - {item.designName}</span>}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.size || "N/A"} • Số lượng: {item.quantity || 1}
                        </p>
                        <p className="text-gray-700 font-medium mt-1">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thanh toán */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Thanh toán</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Phương thức:</span> {selectedOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "VNPay"}</p>
                  {selectedOrder.shippingFee > 0 && (
                    <p><span className="font-medium">Phí vận chuyển:</span> {formatCurrency(selectedOrder.shippingFee)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Xác nhận hủy đơn hàng</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">Vui lòng chọn lý do hủy đơn hàng:</p>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">-- Chọn lý do --</option>
                  {cancelReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeCancelModal}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;