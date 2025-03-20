import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import uploadImage from "../../utils/uploadImage";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";

const AddCategory = ({ fetchData, close }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });

      console.log(response.data.data);

      if (response.data.success) {
        toast.success(response.data.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await uploadImage(file);
    const imageUrl = response.data.data.url;
    console.log("categorImage", response.data.data.url);
    setData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
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
            <label htmlFor="categoryName">Tên danh mục </label>
            <input
              type="text"
              id="categoryName"
              placeholder="Nhập tên danh mục"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="border border-gray-200 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>

          <div className="">
            <p>Hinh anh</p>
            <div className="flex gap-3 items-center">
              <div className="border border-gray-200 bg-blue-50 h-36 w-36 flex items-center justify-center">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full "
                  />
                ) : (
                  <p className="text-sm">Chua co hinh anh</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`
                            ${
                              data.name
                                ? "border-gray-200 border text-sm p-3 px-3 hover:text-white font-semibold rounded-md hover:bg-primary cursor-pointer"
                                : "bg-gray-200 text-sm  p-3 px-3 text-gray-400 rounded"
                            }`}
                >
                  Thêm hình ảnh
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  name=""
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            className={`
            ${
              data.name && data.image
                ? "bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
                : "bg-gray-200 text-sm  p-3 px-3 text-gray-400 rounded"
            }`}
          >
            {loading ? "....." : "Thêm danh mục"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
