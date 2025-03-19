import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaCaretRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import testData from "../../data/TestData";
import emptyCart from "../../assets/emptyCart.jpeg";
import Devider from "../UI/Devider";

const CartDisplay = ({ close }) => {
  const [quantities, setQuantities] = useState(() =>
    testData.map(() => 1)
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const redirectToCheckout = ()=>{
      navigate("/checkout")
      if(close){
        close()
      }
  }
  // Thêm class overflow-hidden cho body khi giỏ hàng mở
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Vô hiệu hóa cuộn body
    return () => {
      document.body.style.overflow = "auto"; // Khôi phục cuộn khi đóng
    };
  }, []); // Chạy khi component mount/unmount

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const increaseQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantities[index] + 1;
    setQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      newQuantities[index] = newQuantities[index] - 1;
      setQuantities(newQuantities);
    }
  };

  return (
    <section className="bg-neutral-900/60 fixed top-0 z-50 bottom-0 right-0 left-0">
      <div className="bg-white w-full max-w-200 h-full ml-auto">
        <div className="flex justify-between shadow-lg p-5 text-xl">
          <h2 className="font-semibold">Giỏ hàng của bạn</h2>
          <button onClick={close}>
            <IoCloseOutline size={30} />
          </button>
        </div>

        <div className="min-h-[80vh] h-full max-h-[calc(100vh-160px)] overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <img src={emptyCart} alt="Giỏ hàng trống" className="w-100" />
            </div>
          ) : testData.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col">
              <img src={emptyCart} alt="Giỏ hàng trống" className="w-100" />
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <>
              <div className="p-2 m-2">
                <div className="bg-white rounded-xl grid gap-2 overflow-auto max-h-[calc(100%-200px)]">
                  {testData.map((product, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 shadow bg-slate-50 rounded-lg">
                      <div>
                        <input type="checkbox" className="w-6 h-6" />
                        
                      </div>
                      <div className=" w-30 h-30 p-1 rounded flex-shrink-0">
                        <img
                          src={product.images}
                          alt={product.name}
                          className="w-full h-full object-scale-down"
                        />
                      </div>
                      <div className="flex-1 ml-2">
                        <p className="text-xl ">{product.name}</p>
                        <p className=" font-semibold text-sky-900">{product.price}</p>
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
                            value={quantities[index]}
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
                    <p>Tống số sản phẩm</p>
                    <p>{testData.length}</p>
                  </div>
                  <div className="flex justify-between px-6">
                    <p>Tổng tiền hàng</p>
                    <p>
                    100.000 VND
                    </p>
                  </div>
                  <div className="flex justify-between px-6">
                    <p>Phí vận chuyển</p>
                    <div className="flex gap-1 items-center">
                      <p className="line-through text-xs text-gray-700">30.000VND</p>
                      <p className="text-green-700">Free</p>
                    </div>
                  </div>
                  <Devider />
                  <div className="flex justify-between px-6">
                    <p className="font-semibold">Tổng thanh toán</p>
                    <p>
                      100.000 VND
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 p-2">
          {!loading && testData.length > 0 ? (
            <div onClick={redirectToCheckout} className="bg-green-700 p-5 py-5 rounded text-white flex justify-between">
              100.000 VND
              <div>
                <button  className="flex items-center gap-1">
                  Thanh toán
                  <FaCaretRight />
                </button>
              </div>
            </div>
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