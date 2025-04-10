import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";
import { confirmBox } from "../../utils/ShowAlert";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import toast from "react-hot-toast"; // Thêm import toast

const AdminCardDesign = ({ data, fetchData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDeleteDesign = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteDesign,
        data: { designId: data._id }, // Gửi designId thay vì _id trực tiếp
      });

      if (response.data.success) {
        toast.success("Xóa thiết kế thành công!"); // Thông báo thành công
        fetchData(); // Cập nhật danh sách
      } else {
        toast.error(response.data.message || "Không thể xóa thiết kế!");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    confirmBox(
     
      handleDeleteDesign
    );
  };

  const handleCustomize = () => {
    navigate("/design", { state: { designToEdit: data } });
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Image Container */}
      <div className="relative bg-gray-100">
        <img
          src={data?.thumbnail}
          alt={data.name}
          className="w-full h-full object-cover transition-opacity duration-300"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loading size={8} color="#9CA3AF" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="px-4 py-2">
        {/* Title and Status */}
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-semibold text-gray-800 truncate flex-1"
            title={data?.name}
          >
            {data?.name}
          </h3>
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              data?.isPublic
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data?.isPublic ? (
              <span className="flex items-center">
                <FiEye/>
              </span>
            ) : (
              <span className="flex items-center">
                <FiEyeOff />
              </span>
            )}
          </span>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-green-500 mb-2">
          {data?.basePrice?.toLocaleString()} ₫
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-2">
          <button
            onClick={confirmDelete}
            disabled={loading}
            className={`flex items-center justify-center p-2 rounded-lg ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-red-50 hover:text-red-700"
            } transition-colors duration-200`}
            title="Xóa thiết kế"
          >
            {loading ? (
              <Loading size={6} color="#9CA3AF" />
            ) : (
              <>
                <MdDelete size={20} className="mr-1" />
                <span className="text-sm">Xóa</span>
              </>
            )}
          </button>

          <button
            onClick={handleCustomize}
            className="flex items-center justify-center p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
            title="Chỉnh sửa thiết kế"
          >
            <MdEdit size={20} className="mr-1" />
            <span className="text-sm">Sửa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCardDesign;