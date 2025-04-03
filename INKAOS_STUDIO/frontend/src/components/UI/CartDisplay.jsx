import React, { useState, useEffect } from "react";
import { IoCloseOutline, IoTrashOutline } from "react-icons/io5";
import { FaCaretRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import emptyCart from "../../assets/emptyCart.jpeg";
import Devider from "../UI/Devider";
import { useGlobalContext } from "../../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import { BiTrash } from "react-icons/bi";
import { FaTrash } from "react-icons/fa6";
import { GiTrashCan } from "react-icons/gi";
import { HiTrash } from "react-icons/hi2";

const CartDisplay = ({ close }) => {
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { fetchCartItem } = useGlobalContext();
  const [quantities, setQuantities] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // State để theo dõi các mục được chọn
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectToCheckout = () => {
    navigate("/checkout");
    if (close) close();
  };

  // Khởi tạo quantities và selectedItems từ cartItem
  useEffect(() => {
    if (cartItem.length > 0) {
      setQuantities(cartItem.map((item) => item.quantity));
      setSelectedItems(cartItem.map(() => false)); // Mặc định không chọn mục nào
    }
    setLoading(false);
  }, [cartItem]);

  // Ngăn cuộn trang khi mở giỏ hàng
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Cập nhật số lượng qua API
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQuantity,
        data: { _id: itemId, qty: newQuantity },
      });
      if (response.data.success) {
        toast.success("Đã cập nhật số lượng!");
        fetchCartItem();
        console.log(response.data.data);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật số lượng!");
      console.error(error);
    }
  };
  const deleteItem = async (itemId) => {
    try {
      const response = await Axios({
       ...SummaryApi.deleteCartItem,
       data: { itemId }
      });
      if (response.data.success) {
        toast.success("Đã xóa sản phẩm!");
        fetchCartItem();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm!");
      console.error(error);
    }
  };
  const increaseQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
    updateQuantity(cartItem[index].itemId._id, newQuantities[index]);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      // Giảm số lượng nếu lớn hơn 1
      newQuantities[index] -= 1;
      setQuantities(newQuantities);
      updateQuantity(cartItem[index].itemId._id, newQuantities[index]);
    } else if (newQuantities[index] === 1) {
      // Xóa mục nếu số lượng giảm từ 1 xuống 0
      deleteItem(cartItem[index].itemId._id);
    }
  };

  // Xử lý khi checkbox thay đổi
  const handleCheckboxChange = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);
  };

  // Tính tổng giá của các mục được chọn
  const totalPrice = cartItem.reduce((sum, item, index) => {
    return selectedItems[index]
      ? sum + item.itemId.totalPrice * item.quantity
      : sum;
  }, 0);

  const toggleSelectedAll = () => {
    const allSelected = selectedItems.every(Boolean);
    setSelectedItems(selectedItems.map(() => !allSelected));
  };

  return (
    <section className="bg-neutral-900/60 fixed top-0 z-50 bottom-0 right-0 left-0">
      <div className="bg-white w-full max-w-180 h-full ml-auto">
        <div className="flex justify-between shadow-lg p-5 text-xl">
          <h2 className="font-semibold">Giỏ hàng của bạn </h2>
          <button onClick={close}>
            <IoCloseOutline size={30} />
          </button>
        </div>

        <div className="min-h-[80vh] h-full max-h-[calc(100vh-160px)] overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <img src={emptyCart} alt="Giỏ hàng trống" className="w-100" />
            </div>
          ) : cartItem.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col">
              <img src={emptyCart} alt="Giỏ hàng trống" className="w-100" />
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <>
              <div className="p-2 m-2 ">
                <div className="p-2">
                  <label className="flex items-center mb-4 text-gray-700">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedItems.every(Boolean)}
                      onChange={toggleSelectedAll}
                    />
                    <span className="ml-2 font-medium">
                      Chọn tất cả {selectedItems.filter(Boolean).length}/
                      {cartItem.length}
                    </span>
                  </label>
                </div>
                <div className="rounded-xl grid gap-2.5 overflow-auto max-h-[calc(100%-200px)] ">
                  {cartItem.map((item, index) => (
                    <div
                      key={item._id}
                      className="flex border border-gray-200 items-center gap-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <input
                          type="checkbox"
                          className="w-5 h-5"
                          checked={selectedItems[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </div>
                      <div className="w-30 h-30 p-1 rounded flex-shrink-0">
                        <img
                          src={item.itemId.designImage}
                          alt={item.itemId.productName}
                          className={`w-full h-full rounded-md border border-gray-200 object-scale-down`}
                          style={{ backgroundColor: item.itemId.colorCode }}
                        />
                      </div>
                      <div className="flex-1 ml-2">
                        <p className="text-xl">
                          {item.itemId.productName} in hình{" "}
                          {item.itemId.designName}
                        </p>
                        <p className="font-semibold text-sky-900">
                          {item.itemId.totalPrice.toLocaleString()} VND
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center bg-white rounded">
                          <button
                            onClick={() => decreaseQuantity(index)}
                            className="px-2 text-black text-xl w-6 h-8 bg-slate-100"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={quantities[index] || item.quantity}
                            readOnly
                            className="mx-2 w-8 text-center rounded-2xl text-black"
                          />
                          <button
                            onClick={() => increaseQuantity(index)}
                            className="px-2 w-6 h-8 text-black bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div 
                      onClick={()=>deleteItem(item.itemId._id)}
                      className=" text-gray-300 hover:text-red-300 w-5 flex items-center justify-center">
                        <HiTrash />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-2 m-2">
                <div className="bg-white shadow rounded-xl border py-4 border-slate-100">
                  <h3 className="font-semibold text-xl pb-2 px-4">
                    Chi tiết thanh toán
                  </h3>
                  <div className="flex justify-between px-6">
                    <p>Tổng số sản phẩm được chọn</p>
                    <p>{selectedItems.filter(Boolean).length}</p>
                  </div>
                  <div className="flex justify-between px-6">
                    <p>Tổng tiền hàng</p>
                    <p>{totalPrice.toLocaleString()} VND</p>
                  </div>
                  {/* <div className="flex justify-between px-6">
                    <p>Phí vận chuyển</p>
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-gray-700">
                        30.000 VND
                      </p>
                      <p className="text-green-700">Free</p>
                    </div>
                  </div> */}
                  <Devider />
                  <div className="flex justify-between px-6">
                    <p className="font-semibold">Tổng thanh toán</p>
                    <p>{totalPrice.toLocaleString()} VND</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 p-2">
          {!loading && cartItem.length > 0 ? (
            <button
              onClick={redirectToCheckout}
              disabled={selectedItems.filter(Boolean).length === 0}
              className={`w-full p-5 py-5 rounded text-white flex justify-between cursor-pointer transition-colors
                ${
                  selectedItems.filter(Boolean).length > 0
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-primary-darker text-gray-700 disabled:cursor-not-allowed"
                }
                `}
            >
              {totalPrice.toLocaleString()} VND
              <div className="flex justify-between items-center gap-1">
                <p>Thanh toán</p>

                <div>
                  <FaCaretRight />
                </div>
              </div>
            </button>
          ) : (
            <Link
              to="/"
              className="bg-blue-500 p-3 py-4 rounded text-white flex justify-center"
            >
              Mua sắm ngay
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartDisplay;
