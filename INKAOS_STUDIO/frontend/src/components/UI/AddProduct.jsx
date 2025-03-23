import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete, MdFileUpload } from "react-icons/md";
import uploadImage from "../../utils/uploadImage";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";

const AddProduct = ({ close }) => {
  const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(true)
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  //   console.log(allSubCategory);
  const [data, setData] = useState({
    name: "",
    image: [],
    subCategory: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
  });

//  console.log(data)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setLoadingImage(true);
    const response = await uploadImage(file);
    const imageUrl = response.data.data.url;
    // console.log(imageUrl);
    setData((preve) => ({
      ...preve,
      image: [...preve.image, imageUrl],
    }));
    setLoadingImage(false);
  };

  const deleteImage = (index) => {
    data.image.splice(index, 1),
      setData((preve) => ({
        ...preve,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Thêm sản phẩm mới</h2>
          <button onClick={close}>
            <IoCloseOutline
              size={30}
              className="text-gray-600 hover:text-gray-800"
            />
          </button>
        </div>

        <form
          className="p-4 pb-10 grid gap-4 h-[80vh] overflow-auto"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-1">
            <label htmlFor="productName">Tên sản phẩm</label>
            <input
              type="text"
              id="productName"
              placeholder="Nhập tên sản phẩm"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="ProductDescription">Mô tả sản phẩm</label>
            <textarea
              id="ProductDescription"
              rows={3}
              placeholder="Nhập mô tả sản phẩm"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded resize-none"
            />
          </div>

          <div>
            <p>Hình ảnh</p>
            <label
              htmlFor="productImage"
              className="bg-gray-100 h-20 flex justify-center cursor-pointer"
            >
              <div className="flex flex-col justify-center items-center text-gray-700">
                {loadingImage ? (
                  <Loading />
                ) : (
                  <>
                    <MdFileUpload size={25} />
                    <p className="text-xs">Tải hình ảnh từ máy</p>
                  </>
                )}
              </div>
              <input
                type="file"
                name="image"
                id="productImage"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
            </label>

            <div className="flex gap-2 p-2 flex-wrap">
              {data.image.map((image, index) => (
                <div
                  key={image + index}
                  className="relative h-20 w-20 bg-blue-50 border border-gray-100"
                >
                  <img
                    src={image}
                    alt={`Hình ảnh sản phẩm ${index + 1}`}
                    className="h-full w-full bg-blue-50 object-cover"
                  />
                  <div
                    className="absolute right-0 bottom-0.5 text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => deleteImage(index)}
                  >
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="productSubCategory">Phân loại</label>
            <div>
              <select
                name="subCategory"
                id="productSubCategory"
                className="w-full border border-gray-300 bg-blue-50 rounded p-1 focus-within:border-gray-600 outline-none"
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );
                  console.log(subCategory);
                  setData((preve) => ({
                    ...preve,
                    subCategory: subCategory,
                  }));
                }}
              >
                <option value="" className="text-gray-500">
                  Chọn phân loại
                </option>
                {allSubCategory.map((subcategory, index) => (
                  <option key={index} value={subcategory?._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="productStock">Số lượng tồn kho</label>
            <input
              type="number"
              id="productStock"
              placeholder="Nhập số lượng sản phẩm"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              min="0"
              required
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="productprice">Giá</label>
            <input
              type="number"
              id="productprice"
              placeholder="Nhập giá sản phẩm"
              name="price"
              value={data.price}
              onChange={handleChange}
              min="0"
              required
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="productDiscount">Giảm giá (%)</label>
            <input
              type="number"
              id="productDiscount"
              placeholder="Nhập phần trăm giảm giá sản phẩm"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>
          
            <button className={`
            ${data.name && data.description && data.image && data.stock && data.price &&data.subCategory?
                ("w-full h-12 bg-primary p-2 text-sm px-3 flex items-center justify-center hover:text-white font-semibold rounded-md hover:bg-primary-darker")
                : ("w-full h-12 flex items-center justify-center bg-gray-200 text-sm  p-3 px-3 text-gray-400 rounded")
            }
            `}
            
            >
                {
                    loading ? (<Loading/>) : 'Thêm sản phẩm'
                }
            </button>
          
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
