import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../provider/GlobalProvider";
const AddAddress = ({ close }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    isDefault: false,
  });
  const { fetchAddress } = useGlobalContext();
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nhập tên người nhận";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Nhập số điện thoại";
    if (!formData.address) newErrors.address = "Nhập địa chỉ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      close();
      console.log("Địa chỉ mới:", formData);
      try {
        const response = await Axios({
          ...SummaryApi.createAddress,
          data: formData,
        });

        if (response.data.success) {
          fetchAddress();
          close();
          toast.success(response.data.message);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    }
  };

  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Thêm địa chỉ mới</h2>
          <button onClick={close}>
            <IoCloseOutline
              size={30}
              className="text-gray-600 hover:text-gray-800"
            />
          </button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              placeholder="Tên người nhận"
              className="border border-gray-400 p-2 rounded"
              value={formData.name}
              onChange={handleChange}
              //   required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Số điện thoại"
              className="border border-gray-400 p-2 rounde"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
            <textarea
              rows="3"
              name="address"
              placeholder="Địa chỉ (số nhà, tên đường, quận, huyện, tỉnh-thành phố)"
              className="border border-gray-400 p-2 rounde"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
            <label className="flex gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              <p>Chọn làm mặc định</p>
            </label>

            <div className="flex justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={close}
                className="p-3 border border-gray-200 font-semibold hover:bg-gray-100 w-28 rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="p-3 bg-primary text-white font-semibold hover:bg-blue-600 w-28 rounded-md"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddAddress;
