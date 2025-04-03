import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import EditProduct from "./EditProduct";
import { confirmBox } from "../../utils/ShowAlert";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import Loading from "./Loading";


const AdminCardProduct = ({ data, fetchData }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id }
      });

      if (response.data.success) {
        fetchData();
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
    <div className="w-full max-w-xs bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loading size={8} color="#9CA3AF" />
          </div>
        )}
        <img
          src={data?.image[0] || "https://via.placeholder.com/300"}
          alt={data?.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Content Container */}
      <div className="px-4 py-2">
        {/* Product Name */}
        <h3
          className="text-lg font-semibold text-gray-800 truncate mb-2"
          title={data?.name}
        >
          {data?.name}
        </h3>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-green-600">
            {data?.basePrice?.toLocaleString("vi-VN")} ₫
          </p>
          <div className="flex items-center text-blue-600">
            <FiPackage className="mr-1" />
            <span className="font-medium text-sm">{data?.totalStock} sp</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-2">
          <button
            onClick={confirmDelete}
            disabled={loading}
            className={`flex items-center justify-center p-2 rounded-lg ${
              loading
                ? "bg-gray-100 text-gray-400"
                : "text-red-500 hover:bg-red-50 hover:text-red-700"
            } transition-colors duration-200`}
            title="Xóa sản phẩm"
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
            onClick={() => setOpenEdit(true)}
            className="flex items-center justify-center p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
            title="Chỉnh sửa sản phẩm"
          >
            <MdEdit size={20} className="mr-1" />
            <span className="text-sm">Sửa</span>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
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