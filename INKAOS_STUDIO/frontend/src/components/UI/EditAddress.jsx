import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { useDispatch } from "react-redux";
import { handleAddAddress } from "../../store/addressSlice";
import toast from "react-hot-toast";

const EditAddress = ({ close, data }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    address: data?.address || "",
    isDefault: data?.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Khởi tạo formData từ prop data khi component mount
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        isDefault: data.isDefault || false,
      });
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!formData.name) newErrors.name = "Tên người nhận là bắt buộc";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    if (!formData.address) newErrors.address = "Địa chỉ là bắt buộc";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
    try {
      const updatedData = { ...formData, _id: data._id }; // Thêm _id vào dữ liệu gửi đi
      console.log("Request Data:", updatedData); // Log để kiểm tra
  
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: updatedData,
      });
      console.log("API Response:", response.data.data);
      if (response.data.success) {
        toast.success("Cập nhật địa chỉ thành công!");
        dispatch(handleAddAddress(response.data.data));
        close();
      }
    } catch (error) {
      console.error("Submit error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      });
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Chỉnh sửa địa chỉ</h2>
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
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Số điện thoại"
              className="border border-gray-400 p-2 rounded" // Sửa typo "rounde"
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
              className="border border-gray-400 p-2 rounded" // Sửa typo "rounde"
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
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="p-3 bg-primary text-white font-semibold hover:bg-blue-600 w-28 rounded-md"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditAddress;