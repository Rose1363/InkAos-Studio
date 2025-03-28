import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete, MdFileUpload } from "react-icons/md";
import uploadImage from "../../utils/uploadImage";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import showAlert from "../../utils/ShowAlert";
import Axios from "../../utils/Axios";

const AddProduct = ({ close }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const allCategory = useSelector((state)=>state.product.allCategory)
 
  
  const [data, setData] = useState({
    name: "",
    image: [],
    category: "",
    subCategory: "",
    basePrice: "",
    material: "",
    description: "",
    variants: [
      {
        color: "",
        colorCode: "#000000",
        sizes: [{ name: "", price: "", stock: "" }],
      },
    ],
    design: null, // Thêm trường design
    designPlacement: { x: 0.5, y: 0.3, scale: 1.0 }, // Thêm trường mới
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...data.variants];
    newVariants[index][field] = value;
    setData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const newVariants = [...data.variants];
    newVariants[variantIndex].sizes[sizeIndex][field] = value;
    setData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          colorCode: "#000000", // Luôn có giá trị mặc định
          sizes: [{ name: "", price: "", stock: "" }],
        },
      ],
    }));
  };

  const addSize = (variantIndex) => {
    const newVariants = [...data.variants];
    newVariants[variantIndex].sizes.push({ name: "", price: "", stock: "" });
    setData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingImage(true);
    const response = await uploadImage(file);
    const imageUrl = response.data.data.url;
    setData((prev) => ({
      ...prev,
      image: [...prev.image, imageUrl],
    }));
    setLoadingImage(false);
  };

  const deleteImage = (index) => {
    setData((prev) => {
      const newImages = [...prev.image];
      newImages.splice(index, 1);
      return { ...prev, image: newImages };
    });
  };
  // console.log(data);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dữ liệu trước khi gửi
    const invalidVariants = data.variants.some(variant => {
      return !variant.color || 
             !variant.colorCode ||
             variant.sizes.some(size => !size.name || isNaN(size.price) || isNaN(size.stock));
    });
  
    if (invalidVariants) {
      showAlert({ 
        title: "Vui lòng kiểm tra lại thông tin biến thể (màu sắc, kích thước, giá, tồn kho)", 
        icon: "error" 
      });
      return;
    }
  
    try {
      setLoading(true);
      
      // Chuẩn hóa dữ liệu trước khi gửi
      const submitData = {
        ...data,
        variants: data.variants.map(variant => ({
          ...variant,
          sizes: variant.sizes.map(size => ({
            name: size.name, // Đảm bảo có name
            price: Number(size.price) || Number(data.basePrice),
            stock: Number(size.stock) || 0
          }))
        }))
      };
  
      console.log("Dữ liệu chuẩn bị gửi:", submitData);
  
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: submitData
      });
      console.log("response:", response.data.data);
      if (response.data.success) {
        showAlert({ title: response.data.message, icon: "success" });
        // Reset form...
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
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
            <label htmlFor="productMaterial">Chất liệu</label>
            <input
              type="text"
              id="productMaterial"
              placeholder="Ví dụ: Cotton 100%"
              name="material"
              value={data.material}
              // onChange={(e) => setData({ ...data, material: e.target.value })}
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
                  <Loading size="medium"/>
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
            <label htmlFor="productCategory">Chon danh muc</label>
            <select
              name="category"
              id="productCategory"
              className="w-full border border-gray-300 bg-blue-50 rounded p-1 focus-within:border-gray-600 outline-none"
              onChange={handleChange}
            >
              <option value="">Chon danh muc</option>
              {allCategory.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="productSubCategory">Chon kieu dang</label>
            <select
              name="subCategory"
              id="productSubCategory"
              className="w-full border border-gray-300 bg-blue-50 rounded p-1 focus-within:border-gray-600 outline-none"
              onChange={handleChange}
            >
              <option value="">Chon kieu dang</option>
              {allSubCategory.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="productBasePrice">Giá cơ bản</label>
            <input
              type="number"
              id="productBasePrice"
              placeholder="Nhập giá cơ bản"
              name="basePrice"
              value={data.basePrice}
              onChange={handleChange}
              min="0"
              required
              className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label>Biến thể</label>
            {data.variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="border p-2 mb-2 rounded ">
                <div className="flex gap-2 mb-2 ">
                  <input
                    type="text"
                    placeholder="Màu sắc (ví dụ: Đen)"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, "color", e.target.value)
                    }
                    className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded  w-2/3"
                  />
                  <div className="w-1/3 flex items-center">
                    <input
                      type="color"
                      value={variant.colorCode}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "colorCode",
                          e.target.value
                        )
                      }
                      className="h-10 w-full cursor-pointer"
                      required
                    />
                  </div>
                </div>
                {variant.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="flex gap-2 mb-2 ">
                    <input
                      type="text"
                      placeholder="Kích thước (ví dụ: S)"
                      value={size.name}
                      onChange={(e) =>
                        handleSizeChange(
                          variantIndex,
                          sizeIndex,
                          "name",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded w-1/3"
                    />
                    <input
                      type="number"
                      placeholder="Giá"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(
                          variantIndex,
                          sizeIndex,
                          "price",
                          e.target.value
                        )
                      }
                      min="0"
                      className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded w-1/3"
                    />
                    <input
                      type="number"
                      placeholder="Tồn kho"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeChange(
                          variantIndex,
                          sizeIndex,
                          "stock",
                          e.target.value
                        )
                      }
                      min="0"
                      className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded w-1/3"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSize(variantIndex)}
                  className="text-blue-500 hover:underline"
                >
                  Thêm kích thước
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-blue-500 hover:underline"
            >
              Thêm biến thể
            </button>
          </div>

          <button
            className={`${
              data.name &&
              data.description &&
              data.image.length > 0 &&
              data.basePrice &&
              data.category &&
              data.subCategory &&
              data.variants.every(v => 
                v.color && 
                v.colorCode &&
                v.sizes.every(s => 
                  s.name && // Kiểm tra name phải có giá trị
                  (s.price || data.basePrice) && 
                  (s.stock || s.stock === 0)
                )
              )
                ? "w-full h-12 bg-primary p-2 text-sm px-3 flex items-center justify-center hover:text-white font-semibold rounded-md hover:bg-primary-darker"
                : "w-full h-12 flex items-center justify-center bg-gray-200 text-sm p-3 px-3 text-gray-400 rounded"
            }`}
          >
            {loading ? <Loading size="medium"/> : "Thêm sản phẩm"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
