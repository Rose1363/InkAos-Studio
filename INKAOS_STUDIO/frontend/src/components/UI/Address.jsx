import React, { useEffect, useState } from "react";
import Devider from "./Devider.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { BiPlusCircle } from "react-icons/bi";
import { useSelector } from "react-redux";

const Address = ({
  close,
  openAddAddress,
  onAddressSelected,
  defaultAddress,
}) => {
  
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddress, setSelectedAddress] = useState(0);
  useEffect(() => {
    if (defaultAddress && addressList.length > 0) {
      const defaultIndex = addressList.findIndex(
        (address) => address._id === defaultAddress._id
      );
      if (defaultAddress !== -1) {
        setSelectedAddress(defaultIndex);
      }
    }
  }, [defaultAddress, addressList]);

  
  const handleConfirm = () => {
    const selected = addressList[selectedAddress];
    onAddressSelected(selected);
    close();
  };
  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white my-28 mx-auto w-full max-w-lg rounded">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Địa chỉ của tôi</h2>
          <button onClick={close}>
            <IoCloseOutline size={30} />
          </button>
        </div>

        <div className="p-4 overflow-auto h-100">
          <div className="px-4">
            {addressList.map((address, index) => (
              <label htmlFor={"address" + index} key={index}>
                <div className="flex gap-3">
                  <div>
                    <input
                      type="radio"
                      value={index}
                      onChange={(e) =>
                        setSelectedAddress(Number(e.target.value))
                      }
                      name="address"
                      id={"address" + index}
                      checked={selectedAddress === index}
                    />
                  </div>
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="font-semibold">{address.name}</p>
                      <p>{address.phoneNumber}</p>
                      <p>{address.address}</p>
                    </div>
                    {address.isDefault && (
                      <div className="bg-green-100 max-h-6 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        Mặc định
                      </div>
                    )}
                  </div>
                </div>
                <Devider />
              </label>
            ))}
          </div>

          <div
            onClick={openAddAddress}
            className="cursor-pointer hover:bg-gray-200 m-3 border border-dashed p-3 flex gap-2 justify-center items-center"
          >
            <BiPlusCircle />
            Thêm địa chỉ mới
          </div>
        </div>

        <div className="flex justify-center gap-3 p-4">
          <button
            onClick={close}
            className="p-3 border rounded-md border-gray-200 font-semibold hover:bg-gray-100 w-28"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="p-3 border rounded-md border-primary font-semibold bg-primary text-white hover:bg-blue-600 w-28"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </section>
  );
};

export default Address;
