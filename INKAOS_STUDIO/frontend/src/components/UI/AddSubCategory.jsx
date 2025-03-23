import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";

const AddSubCategory = ({ close, fetch }) => {
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    category: "",
  });

  const allCategory = useSelector((state) => state.product.allCategory);
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await Axios({
            ...SummaryApi.addSubCategory,
            data: subCategoryData
        })
        if(response.data.success){
            toast.success(response.data.message)
            close()
            fetch()
            console.log(response.data.data)
        }
    } catch (error) {
        AxiosToastError(error)
    }
  };

  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Thêm danh mục mới</h2>
          <button onClick={close}>
            <IoCloseOutline
              size={30}
              className="text-gray-600 hover:text-gray-800"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4  grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="subCategoryName">Tên danh mục </label>
            <input
              type="text"
              id="subCategoryName"
              placeholder="Nhập tên danh mục"
              value={subCategoryData.name}
              name="name"
              onChange={handleOnChange}
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="subCategoryName">Chọn danh mục</label>
            <select
              onChange={(e)=>{
                const value = e.target.value
                setSubCategoryData((prev) => ({
                    ...prev,
                    category: value, // Lưu ID của danh mục cha
                  }));
            }}
              className="border border-gray-300 bg-blue-50 rounded p-1 focus-within:border-gray-600 outline-none"
            >
              <option value={""} className="text-gray-500">
                Chon danh muc
              </option>
              {
            allCategory.map((category,index)=>{
                return(
                    <option value={category._id}
                    key={category._id+"subcategory"}>{category?.name}</option>
                )
            }
                )
            }
            </select>
          </div>

          <button
            className={`
                ${
                    subCategoryData.name && subCategoryData.category && !loading
                    ? "bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
                    : "bg-gray-200 text-sm  p-3 px-3 text-gray-400 rounded"
                }`}
          >
            {loading ? <Loading /> : "Thêm danh mục"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddSubCategory;
