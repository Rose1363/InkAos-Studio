import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import EditProduct from "./EditProduct";
import { confirmBox } from "../../utils/ShowAlert"; // Chỉ cần confirmBox cho xóa
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";

const AdminCardProduct = ({ data, fetchData }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
       ...SummaryApi.deleteProduct,
       data: {
        _id : data._id
       }
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

  return (
    <div className="w-50 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Hình ảnh sản phẩm */}
      <div className="relative w-full h-48 bg-gray-100 p-3">
        <img
          src={data?.image[0] || "https://via.placeholder.com/150"}
          alt={data?.name}
          className="w-full h-full rounded object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-3">
        <p
          className="text-center font-semibold text-gray-800 text-lg truncate"
          title={data?.name}
        >
          {data?.name}
        </p>

        {/* Giá và tồn kho */}
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-green-600 text-sm">
            {data?.basePrice.toLocaleString("vi-VN")} Đ
          </p>
          <p className="font-bold text-blue-600 text-sm">
            {data?.totalStock} sp
          </p>
        </div>

        {/* Nút hành động */}
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
            onClick={() => setOpenEdit(true)}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors duration-200"
            title="Chỉnh sửa sản phẩm"
          >
            <MdEdit size={20} />
          </button>
        </div>
      </div>
      {openEdit && (
        <EditProduct
          data={data}
          close={() => setOpenEdit(false)}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default AdminCardProduct;