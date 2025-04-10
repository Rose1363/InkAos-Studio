import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { handleAddAddress } from "../store/addressSlice";
import AddAddress from "../components/UI/AddAddress";
import { MdDeleteOutline, MdOutlineEditLocationAlt } from "react-icons/md";

import EditAddress from "../components/UI/EditAddress";
import Loading from "../components/UI/Loading";
import toast from "react-hot-toast";

const Address = () => {
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editdata, setEditData] = useState({});
  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      if (response.data.success) {
        dispatch(handleAddAddress(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Địa chỉ đã được xóa");
        fetchAddress(); 
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  useEffect(() => {
    if (addressList.length === 0) {
      fetchAddress();
    }
  }, [dispatch, addressList.length]);

 

  return (
    <div>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Địa chỉ của tôi</h2>
        <button
          onClick={() => setOpenAddAddress(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm địa chỉ
        </button>
      </div>
      <div className="p-3 mb-3  rounded-lg">
        {loading ? (
          <Loading size="large" />
        ) : addressList.length > 0 ? (
          addressList.map((address, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full bg-gray-100 p-4 mt-2 rounded-md cursor-pointer"
            >
              <div className="flex gap-4">
                <div>
                  <div className="flex gap-3">
                    <p className="font-semibold text-lg">{address.name}</p>
                    <p className="text-gray-600 text-lg">
                      {address.phoneNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-lg">{address.address}</p>
                  </div>
                </div>
                <div>
                  {address.isDefault ? (
                    <p className="bg-green-200 text-xs p-1 rounded-xl">
                      Mặc định
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="p-2 text-blue-900 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-all duration-200 active:scale-85"
                  aria-label="edit address"
                >
                  <MdOutlineEditLocationAlt size={20} />
                </button>
                <button
                  onClick={() => deleteAddress(address._id)}
                  aria-label="delete address"
                  className={`p-2 rounded-full transition-all duration-200 active:scale-85
                    ${address.isDefault ? "cursor-not-allowed text-gray-500": " text-red-900 hover:text-red-500 hover:bg-red-100"}
                    `}
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có địa chỉ</p>
        )}
      </div>
      {openAddAddress && (
        <AddAddress
          close={() => setOpenAddAddress(false)}
         
        />
      )}
      {openEdit && (
        <EditAddress close={() => setOpenEdit(false)} data={editdata} fetchAddess={fetchAddress}/>
      )}
    </div>
  );
};

export default Address;
