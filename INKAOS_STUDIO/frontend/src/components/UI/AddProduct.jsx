import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete, MdFileUpload } from "react-icons/md";
import uploadImage from "../../utils/uploadImage";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import showAlert from "../../utils/ShowAlert";
import Axios from "../../utils/Axios";

const AddProduct = ({ close }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setData((prev) => {
      const newImages = [...prev.image];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(data)
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data,
      });
      // console.log(response.data.data)
      if (response.data.success) {
        showAlert({ title: response.data.message, icon: "success" });
        setData({
          name: "",
          image: [],
          subCategory: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showAlert({ title: "hi", icon: "success" });
  }, []);
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
                  // console.log(subCategory);
                  setData((preve) => ({
                    ...preve,
                    subCategory: value,
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

          <button
            className={`
            ${
              data.name &&
              data.description &&
              data.image.length > 0 &&
              data.stock &&
              data.price &&
              data.subCategory
                ? "w-full h-12 bg-primary p-2 text-sm px-3 flex items-center justify-center hover:text-white font-semibold rounded-md hover:bg-primary-darker"
                : "w-full h-12 flex items-center justify-center bg-gray-200 text-sm  p-3 px-3 text-gray-400 rounded"
            }
            `}
          >
            {loading ? <Loading /> : "Thêm sản phẩm"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;

// export default AddProduct;

// import React, { useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import { MdDelete, MdFileUpload } from "react-icons/md";
// import uploadImage from "../../utils/uploadImage";
// import Loading from "./Loading";
// import { useDispatch, useSelector } from "react-redux";

// const AddProduct = ({ close }) => {
//   const [loadingImage, setLoadingImage] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const allSubCategory = useSelector((state) => state.product.allSubCategory);
//   const dispatch = useDispatch(); // Thêm dispatch nếu cần dùng sau này

//   const [data, setData] = useState({
//     name: "",
//     image: [],
//     subCategory: "",
//     totalStock: "",
//     price: "",
//     promotion: { value: "", type: "percent" },
//     description: "",
//     variants: [
//       {
//         color: "",
//         sizes: [
//           {
//             size: "",
//             price: "",
//             discount: { value: "", type: "percent" },
//             final_price: "",
//             stock: "",
//           },
//         ],
//       },
//     ],
//   });

//   // Xử lý thay đổi input cơ bản
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Xử lý upload hình ảnh tổng quan
//   const handleUploadImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setLoadingImage(true);
//     const response = await uploadImage(file);
//     const imageUrl = response.data.data.url;
//     setData((prev) => ({
//       ...prev,
//       image: [...prev.image, imageUrl],
//     }));
//     setLoadingImage(false);
//   };

//   // Xóa hình ảnh tổng quan
//   const deleteImage = (index) => {
//     setData((prev) => {
//       const newImages = [...prev.image];
//       newImages.splice(index, 1);
//       return { ...prev, image: newImages };
//     });
//   };

//   // Xử lý thay đổi cho biến thể màu sắc
//   const handleColorChange = (index, e) => {
//     const { name, value } = e.target;
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[index] = { ...newVariants[index], [name]: value };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Thêm biến thể màu sắc mới
//   const addColorVariant = () => {
//     setData((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           color: "",
//           sizes: [{ size: "", price: "", discount: { value: "", type: "percent" }, final_price: "", stock: "" }],
//         },
//       ],
//     }));
//   };

//   // Xóa biến thể màu sắc
//   const removeColorVariant = (index) => {
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants.splice(index, 1);
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Xử lý thay đổi cho biến thể kích thước
//   const handleSizeChange = (colorIndex, sizeIndex, e) => {
//     const { name, value } = e.target;
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       const size = { ...newVariants[colorIndex].sizes[sizeIndex] };
//       size[name] = value;

//       // Tính final_price tự động
//       if (name === "price" || name === "discount") {
//         const price = parseFloat(size.price) || 0;
//         const discountValue = parseFloat(size.discount.value) || 0;
//         size.final_price =
//           size.discount.type === "percent"
//             ? price * (1 - discountValue / 100)
//             : price - discountValue;
//       }

//       newVariants[colorIndex].sizes[sizeIndex] = size;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Xử lý thay đổi discount type
//   const handleDiscountTypeChange = (colorIndex, sizeIndex, e) => {
//     const { value } = e.target;
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       const size = { ...newVariants[colorIndex].sizes[sizeIndex] };
//       size.discount.type = value;

//       // Tính lại final_price khi thay đổi type
//       const price = parseFloat(size.price) || 0;
//       const discountValue = parseFloat(size.discount.value) || 0;
//       size.final_price =
//         value === "percent" ? price * (1 - discountValue / 100) : price - discountValue;

//       newVariants[colorIndex].sizes[sizeIndex] = size;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Thêm biến thể kích thước mới
//   const addSizeVariant = (colorIndex) => {
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[colorIndex].sizes.push({
//         size: "",
//         price: "",
//         discount: { value: "", type: "percent" },
//         final_price: "",
//         stock: "",
//       });
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Xóa biến thể kích thước
//   const removeSizeVariant = (colorIndex, sizeIndex) => {
//     setData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[colorIndex].sizes.splice(sizeIndex, 1);
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // Xử lý submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     console.log(data); // Thay bằng API call nếu cần
//     setLoading(false);
//   };

//   return (
//     <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
//       <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl">
//         <div className="flex justify-between shadow-md p-5 text-xl">
//           <h2 className="font-semibold">Thêm sản phẩm mới</h2>
//           <button onClick={close}>
//             <IoCloseOutline size={30} className="text-gray-600 hover:text-gray-800" />
//           </button>
//         </div>

//         <form className="p-4 pb-10 grid gap-4 h-[80vh] overflow-auto" onSubmit={handleSubmit}>
//           {/* Tên sản phẩm */}
//           <div className="grid gap-1">
//             <label htmlFor="productName">Tên sản phẩm</label>
//             <input
//               type="text"
//               id="productName"
//               placeholder="Nhập tên sản phẩm"
//               name="name"
//               value={data.name}
//               onChange={handleChange}
//               required
//               className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
//             />
//           </div>

//           {/* Mô tả */}
//           <div className="grid gap-1">
//             <label htmlFor="ProductDescription">Mô tả sản phẩm</label>
//             <textarea
//               id="ProductDescription"
//               rows={3}
//               placeholder="Nhập mô tả sản phẩm"
//               name="description"
//               value={data.description}
//               onChange={handleChange}
//               required
//               className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded resize-none"
//             />
//           </div>

//           {/* Hình ảnh tổng quan */}
//           <div>
//             <p>Hình ảnh</p>
//             <label
//               htmlFor="productImage"
//               className="bg-gray-100 h-20 flex justify-center cursor-pointer"
//             >
//               <div className="flex flex-col justify-center items-center text-gray-700">
//                 {loadingImage ? (
//                   <Loading />
//                 ) : (
//                   <>
//                     <MdFileUpload size={25} />
//                     <p className="text-xs">Tải hình ảnh từ máy</p>
//                   </>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 name="image"
//                 id="productImage"
//                 accept="image/*"
//                 onChange={handleUploadImage}
//                 className="hidden"
//               />
//             </label>
//             <div className="flex gap-2 p-2 flex-wrap">
//               {data.image.map((image, index) => (
//                 <div
//                   key={image + index}
//                   className="relative h-20 w-20 bg-blue-50 border border-gray-100"
//                 >
//                   <img
//                     src={image}
//                     alt={`Hình ảnh sản phẩm ${index + 1}`}
//                     className="h-full w-full bg-blue-50 object-cover"
//                   />
//                   <div
//                     className="absolute right-0 bottom-0.5 text-gray-500 hover:text-red-500 cursor-pointer"
//                     onClick={() => deleteImage(index)}
//                   >
//                     <MdDelete />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Phân loại */}
//           <div className="grid gap-1">
//             <label htmlFor="productSubCategory">Phân loại</label>
//             <div>
//               <select
//                 name="subCategory"
//                 id="productSubCategory"
//                 className="w-full border border-gray-300 bg-blue-50 rounded p-1 focus-within:border-gray-600 outline-none"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   const subCategory = allSubCategory.find((el) => el._id === value);
//                   setData((prev) => ({
//                     ...prev,
//                     subCategory: subCategory,
//                   }));
//                 }}
//               >
//                 <option value="" className="text-gray-500">
//                   Chọn phân loại
//                 </option>
//                 {allSubCategory.map((subcategory, index) => (
//                   <option key={index} value={subcategory?._id}>
//                     {subcategory.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Tổng số lượng tồn kho */}
//           <div className="grid gap-1">
//             <label htmlFor="productTotalStock">Số lượng tồn kho</label>
//             <input
//               type="number"
//               id="productTotalStock"
//               placeholder="Nhập số lượng sản phẩm"
//               name="totalStock"
//               value={data.totalStock}
//               onChange={handleChange}
//               min="0"
//               required
//               className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
//             />
//           </div>

//           {/* Giá cơ bản */}
//           <div className="grid gap-1">
//             <label htmlFor="productprice">Giá</label>
//             <input
//               type="number"
//               id="productprice"
//               placeholder="Nhập giá sản phẩm"
//               name="price"
//               value={data.price}
//               onChange={handleChange}
//               min="0"
//               required
//               className="border border-gray-300 focus-within:border-gray-600 outline-none p-1 rounded"
//             />
//           </div>

//           {/* Khuyến mãi toàn sản phẩm */}
//           <div className="grid gap-1">
//             <label>Khuyến mãi toàn sản phẩm</label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 name="value"
//                 value={data.promotion.value}
//                 onChange={(e) =>
//                   setData((prev) => ({
//                     ...prev,
//                     promotion: { ...prev.promotion, value: e.target.value },
//                   }))
//                 }
//                 placeholder="Giá trị khuyến mãi"
//                 min="0"
//                 className="border p-1 rounded w-1/2"
//               />
//               <select
//                 name="type"
//                 value={data.promotion.type}
//                 onChange={(e) =>
//                   setData((prev) => ({
//                     ...prev,
//                     promotion: { ...prev.promotion, type: e.target.value },
//                   }))
//                 }
//                 className="border p-1 rounded w-1/2"
//               >
//                 <option value="percent">Phần trăm</option>
//                 <option value="fixed">Cố định</option>
//               </select>
//             </div>
//           </div>

//           {/* Biến thể màu sắc và kích thước */}
//           <div className="grid gap-2">
//             <label>Biến thể sản phẩm</label>
//             {data.variants.map((variant, colorIndex) => (
//               <div key={colorIndex} className="border p-2 rounded">
//                 <div className="grid gap-1">
//                   <label>Màu sắc</label>
//                   <input
//                     type="text"
//                     name="color"
//                     value={variant.color}
//                     onChange={(e) => handleColorChange(colorIndex, e)}
//                     placeholder="Nhập màu sắc"
//                     className="border p-1 rounded w-full"
//                   />
//                 </div>

//                 {/* Biến thể kích thước */}
//                 <div className="mt-2">
//                   <label>Kích thước</label>
//                   {variant.sizes.map((size, sizeIndex) => (
//                     <div key={sizeIndex} className="border p-2 rounded mt-2">
//                       <input
//                         type="text"
//                         name="size"
//                         value={size.size}
//                         onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
//                         placeholder="Kích thước"
//                         className="border p-1 rounded w-full mb-1"
//                       />
//                       <input
//                         type="number"
//                         name="price"
//                         value={size.price}
//                         onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
//                         placeholder="Giá"
//                         min="0"
//                         className="border p-1 rounded w-full mb-1"
//                       />
//                       <div className="flex gap-2 mb-1">
//                         <input
//                           type="number"
//                           name="discount"
//                           value={size.discount.value}
//                           onChange={(e) =>
//                             setData((prev) => {
//                               const newVariants = [...prev.variants];
//                               newVariants[colorIndex].sizes[sizeIndex].discount.value = e.target.value;
//                               handleSizeChange(colorIndex, sizeIndex, {
//                                 target: { name: "discount", value: e.target.value },
//                               });
//                               return { ...prev, variants: newVariants };
//                             })
//                           }
//                           placeholder="Giá trị giảm giá"
//                           min="0"
//                           className="border p-1 rounded w-1/2"
//                         />
//                         <select
//                           value={size.discount.type}
//                           onChange={(e) => handleDiscountTypeChange(colorIndex, sizeIndex, e)}
//                           className="border p-1 rounded w-1/2"
//                         >
//                           <option value="percent">Phần trăm</option>
//                           <option value="fixed">Cố định</option>
//                         </select>
//                       </div>
//                       <input
//                         type="number"
//                         name="final_price"
//                         value={size.final_price}
//                         readOnly
//                         placeholder="Giá cuối cùng"
//                         className="border p-1 rounded w-full mb-1 bg-gray-100"
//                       />
//                       <input
//                         type="number"
//                         name="stock"
//                         value={size.stock}
//                         onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
//                         placeholder="Tồn kho"
//                         min="0"
//                         className="border p-1 rounded w-full mb-1"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeSizeVariant(colorIndex, sizeIndex)}
//                         className="text-red-500 mt-2"
//                       >
//                         Xóa kích thước
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addSizeVariant(colorIndex)}
//                     className="text-blue-500 mt-2"
//                   >
//                     Thêm kích thước
//                   </button>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => removeColorVariant(colorIndex)}
//                   className="text-red-500 mt-2"
//                 >
//                   Xóa màu
//                 </button>
//               </div>
//             ))}
//             <button type="button" onClick={addColorVariant} className="text-blue-500">
//               Thêm màu sắc
//             </button>
//           </div>

//           {/* Nút submit */}
//           <button
//             className={`${
//               data.name &&
//               data.description &&
//               data.image.length > 0 &&
//               data.totalStock &&
//               data.price &&
//               data.subCategory
//                 ? "w-full h-12 bg-primary p-2 text-sm px-3 flex items-center justify-center hover:text-white font-semibold rounded-md hover:bg-primary-darker"
//                 : "w-full h-12 flex items-center justify-center bg-gray-200 text-sm p-3 px-3 text-gray-400 rounded"
//             }`}
//           >
//             {loading ? <Loading /> : "Thêm sản phẩm"}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AddProduct;
