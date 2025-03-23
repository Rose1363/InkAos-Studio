import React, { useEffect, useState } from "react";
import AddSubCategory from "../components/UI/AddSubCategory";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import NoData from "../components/UI/NoData"; // Component hiển thị khi không có dữ liệu
import { BiEdit } from "react-icons/bi";
import { FcDeleteDatabase, FcDeleteRow } from "react-icons/fc";
import { LuDelete } from "react-icons/lu";

const AdminSubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      if (response.data.success) {
        setSubCategoryData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  //   console.log(subCategoryData);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shadow-md p-4 bg-white rounded-lg">
        <h2 className="font-semibold text-lg text-gray-800">
          Danh mục sản phẩm con
        </h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm danh mục con
        </button>
      </div>

      {/* Hiển thị khi không có dữ liệu */}
      {!loading && subCategoryData.length === 0 && (
        <NoData message="Chưa có danh mục con nào!" />
      )}

      {/* Bảng hiển thị danh mục con */}
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            {/* Tiêu đề bảng */}
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-4  font-semibold ">
                  STT
                </th>
                <th className="text-left p-4  font-semibold">
                  Tên danh mục con
                </th>
                <th className="text-left p-4 font-semibold ">
                  Danh mục cha
                </th>
                <th className="text-left p-4  font-semibold ">
                  Tùy chọn
                </th>
              </tr>
            </thead>

            {/* Nội dung bảng */}
            <tbody>
              {loading
                ? // Skeleton loading
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="text-center p-4">
                          <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </td>
                      </tr>
                    ))
                : // Dữ liệu danh mục con
                  subCategoryData.map((subCategory, index) => (
                    <tr key={subCategory._id}>
                      <td className="p-4 text-gray-700">{index + 1}</td>
                      <td className="p-4 ">
                        {subCategory.name}
                      </td>
                      <td className="p-4 ">
                        {subCategory.category?.name || "Không có danh mục cha"}
                      </td>
                      <td className="p-4  text-gray-700">
                        <div className="flex gap-3">
                          <button
                            aria-label="edit subcategory"
                            className="p-1 text-blue-900 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-all duration-200 active:scale-85"
                          >
                            <BiEdit size={18} />
                          </button>
                          <button
                            aria-label="delete subcategory"
                            className="p-1 text-red-900 hover:text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 active:scale-85"
                          >
                            <LuDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm danh mục con */}
      {openAddSubCategory && (
        <AddSubCategory
          close={() => setOpenAddSubCategory(false)}
          fetch={fetchSubCategory}
        />
      )}
    </section>
  );
};

export default AdminSubCategory;
