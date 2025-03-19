import React, { useEffect, useState } from "react";
import Devider from "../components/UI/Devider";
import { FaCaretRight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import testData from "../data/TestData";
import { MdCreditScore, MdOutlineCreditCard } from "react-icons/md";
import { RiMoneyDollarBoxLine, RiMoneyDollarBoxFill } from "react-icons/ri";
import Address from "../components/UI/Address";
import AddAddress from "../components/UI/AddAddress";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import { handleAddAddress } from "../store/addressSlice";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
const Checkout = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  // const addressList = useSelector((state) => state.addresses.addressList);
  const dispatch = useDispatch();
  const [defaultAddress, setDefaultAddress] = useState(null);

  // Hàm fetch địa chỉ
  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });

      if (response.data.success) {
        // Dispatch dữ liệu vào Redux store
        dispatch(handleAddAddress(response.data.data));
        const defaultAddr =
          response.data.data.find((address) => address.isDefault) ||
          response.data.data[0];
        setDefaultAddress(defaultAddr);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const hadleAddressSelected = (selected) => {
    setDefaultAddress(selected);
  };

  // Gọi fetchAddress khi component mount
  useEffect(() => {
    fetchAddress();
  }, []); // Chỉ gọi một lần khi component được mount

  // console.log("danh sach dia chi", addressList);

  const handleAddressAdded = () => {
    fetchAddress();
  };
  const handleOpenAddAddress = () => {
    setOpenAddress(false);
    setOpenAddAddress(true);
  };

  const handleCloseAddAddress = () => {
    setOpenAddress(true);
    setOpenAddAddress(false);
  };

  return (
    <section className="bg-white p-6">
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row">
        <div className="flex-[2]">
          <div className="p-3 mb-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-1">
              <MdLocationOn color="#c30c23" size={25} />
              <h3 className="text-xl font-semibold">Địa chỉ giao hàng</h3>
            </div>

            {defaultAddress ? (
              <div
                onClick={() => setOpenAddress(true)}
                className="flex items-center justify-between w-full bg-white p-3 mt-2 rounded-md cursor-pointer"
              >
                <div>
                  <div className="flex gap-3">
                    <p className="font-semibold">{defaultAddress.name}</p>
                    <p className="text-gray-600">
                      {defaultAddress.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{defaultAddress.address}</p>
                  </div>
                </div>
                <div>
                  <FaCaretRight />
                </div>
              </div>
            ) : (
              <p>Chưa có địa chỉ</p>
            )}
          </div>

          <div className="bg-blue-50 p-5 rounded-md">
            <h3 className="text-xl font-semibold">Sản phẩm</h3>
            <div className="grid gap-2 my-2 max-h-[50vh] overflow-auto">
              {testData.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 shadow bg-white rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={product.images}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-3 my-3 shadow-xl rounded-md border border-gray-100">
            <h3 className="font-semibold text-xl pb-2 px-4">
              Chi tiết thanh toán
            </h3>
            <div className="flex justify-between px-6">
              <p>Tống số sản phẩm</p>
              <p>18</p>
            </div>
            <div className="flex justify-between px-6">
              <p>Tổng tiền hàng</p>
              <p>100.000 VND</p>
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
              <p>100.000 VND</p>
            </div>
          </div>
        </div>

        <div className="h-full sticky top-20  flex-1 bg-white rounded-md shadow-xl p-2 border border-gray-100 ">
          <div className=" p-3">
            <h3 className="text-xl font-semibold">Phương thức thanh toán</h3>
            <div className="py-3">
              <label htmlFor="credit-card">
                <div
                  className={`items-center bg-gray-50 flex gap-4 border border-gray-100  rounded-t-lg p-3 transition-all duration-200
                  ${
                    selectedMethod === "credit-card"
                      ? "bg-gray-100 border-gray-300"
                      : "hover:bg-blue-50 hover:border-gray-300"
                  }                  }
                  
                  `}
                >
                  <input
                    type="radio"
                    id="credit-card"
                    checked={selectedMethod === "credit-card"}
                    onChange={() => setSelectedMethod("credit-card")}
                  />
                  <label htmlFor="credit-card">Thanh toán bằng thẻ</label>
                  {selectedMethod === "credit-card" ? (
                    <MdCreditScore color="#5282c1" size={18} />
                  ) : (
                    <MdOutlineCreditCard />
                  )}
                </div>
              </label>

              <label htmlFor="cod">
                <div
                  className={`items-center bg-gray-50 flex gap-4 border border-gray-100 rounded-b-lg p-3 transition-all duration-200
                   ${
                     selectedMethod === "cod"
                       ? "bg-gray-100 border-gray-300"
                       : "hover:bg-blue-50 hover:border-gray-300"
                   }
                  `}
                >
                  <input
                    type="radio"
                    id="cod"
                    checked={selectedMethod === "cod"}
                    onChange={() => setSelectedMethod("cod")}
                  />
                  <label htmlFor="cod">Thanh toán khi nhận hàng</label>
                  {selectedMethod === "cod" ? (
                    <RiMoneyDollarBoxFill color="green" size={18} />
                  ) : (
                    <RiMoneyDollarBoxLine />
                  )}
                </div>
              </label>
            </div>
          </div>
          <div className="mt-3">
            <button className="bg-primary w-full p-3 rounded-md text-white font-semibold hover:bg-blue-500 transition-colors duration-300">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>

      {openAddress && (
        <Address
          close={() => setOpenAddress(false)}
          openAddAddress={handleOpenAddAddress}
          onAddressSelected={hadleAddressSelected}
          defaultAddress={defaultAddress}
        />
      )}
      {openAddAddress && (
        <AddAddress
          close={handleCloseAddAddress}
          onAddressAdded={handleAddressAdded}
        />
      )}
    </section>
  );
};

export default Checkout;
