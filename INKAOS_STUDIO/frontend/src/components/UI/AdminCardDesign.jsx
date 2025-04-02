import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";
import { confirmBox } from "../../utils/ShowAlert";
import { useNavigate } from "react-router-dom";
const AdminCardDesign = ({ data,fetchData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      if (response.data.success) {
        fetchData(); // Cập nhật danh sách sản phẩm
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    confirmBox(handleDeleteProduct); // Gọi confirmBox với callback xóa
  };

  // Xử lý nút Tùy chỉnh
  const handleCustomize = () => {
    console.log("designToEdit", data);
    navigate("/design", { state: { designToEdit: data } });
  };
  return (
    <div className="w-50 border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div>
        <img
          src={data?.thumbnail}
          alt={data.name}
          className="border-b border-gray-400 w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="my-3">
        <p
          className="px-1 text-center font-semibold text-sm text-gray-800 truncate"
          title={data?.name}
        >
          {data?.name}
        </p>
        <div className="flex gap-3 p-1">
          <p className="text-center font-bold text-md text-primary mt-1">
            {data?.basePrice}
          </p>

          <p className="ml-auto font-bold text-md text-primary mt-1">
            {data?.isPublic ? (
              <span className="text-green-300">public</span>
            ) : (
              <span className="text-red-300">hidden</span>
            )}
          </p>
        </div>
        <div className="flex justify-between mt-1">
          <button
            onClick={confirmDelete} // Gọi confirmDelete khi nhấp
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-200"
            title="Xóa sản phẩm"
            disabled={loading}
          >
            <MdDelete size={20} />
          </button>
          <button
            onClick={handleCustomize}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors duration-200"
            title="Chỉnh sửa sản phẩm"
          >
            <MdEdit size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCardDesign;
