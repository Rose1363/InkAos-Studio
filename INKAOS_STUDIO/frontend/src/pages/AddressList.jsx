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

  useEffect(() => {
    if (addressList.length === 0) {
      fetchAddress();
    }
  }, [dispatch, addressList.length]);

  const handleAddressAdded = () => {
    fetchAddress();
  };

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
           <Loading size="large"/>
        ) : addressList.length > 0 ? (
          addressList.map((address, index) => (
            <div
              key={index} 
              className="flex items-center justify-between w-full bg-gray-100 p-3 mt-2 rounded-md cursor-pointer"
            >
              <div>
                <div className="flex gap-3">
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-gray-600">{address.phoneNumber}</p>
                </div>
                <div>
                  <p className="">{address.address}</p>
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
                <button aria-label="delete address" className="p-2 text-red-900 hover:text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 active:scale-85">
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có địa chỉ</p> // Hiển thị khi không có dữ liệu
        )}
      </div>
      {openAddAddress && (
        <AddAddress
          close={() => setOpenAddAddress(false)}
          onAddressAdded={handleAddressAdded}
        />
      )}
      {openEdit && <EditAddress close={() => setOpenEdit(false)} data={editdata}/>}
    </div>
  );
};

export default Address;
