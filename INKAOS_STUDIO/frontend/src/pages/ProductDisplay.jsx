import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Devider from "../components/UI/Devider";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const ProductDisplay = () => {
  const param = useParams();
  const productId = param?.id?.split("-")?.slice(-1)[0] || null;

  const [data, setData] = useState({
    name: "",
    image: [],
    variants: [],
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const imageContainer = useRef();

  const fetchProductDetail = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetail,
        data: { productId },
      });
      if (response.data.success) {
        setData(response.data.data);
        // setSelectedVariant(response.data.data.variants[0]);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 150;
  };

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 150;
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  // Tính tổng tồn kho của variant được chọn
  const totalStockByVariant =
    selectedVariant?.sizes.reduce((total, size) => total + size.stock, 0) || 0;

  // Tính tồn kho của kích cỡ được chọn
  const stockBySize =
    selectedVariant?.sizes.find((size) => size.name === selectedSize)?.stock ||
    0;

  const totalAllVariantsStock = data.variants.reduce(
    (total, variant) =>
      total + variant.sizes.reduce((sum, size) => sum + size.stock, 0),
    0
  );
  const priceBySize =
    selectedVariant?.sizes.find((size) => size.name === selectedSize)?.price ||
    0;
  const finalPrice = data.basePrice + priceBySize;
  return (
    <section className="container mx-auto py-8 px-4 lg:px-0">
      {/* Phần hiển thị sản phẩm */}
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Bên trái: Ảnh sản phẩm */}
        <div className="p-6 bg-gray-50">
          {/* Ảnh chính */}
          <div className="relative w-full h-[50vh] lg:h-[60vh] bg-white rounded-xl overflow-hidden shadow-md">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Đang tải...</p>
              </div>
            ) : (
              <img
                src={data.image[image]}
                alt={data.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* Dots điều hướng */}
          <div className="flex items-center justify-center gap-2 my-4">
            {data.image.map((_, index) => (
              <div
                key={index}
                onClick={() => setImage(index)}
                className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                  index === image ? "bg-blue-400 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Thumbnail slider */}
          <div className="relative flex items-center">
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <FaAngleLeft className="text-gray-600" />
            </button>
            <div
              ref={imageContainer}
              className="mx-7 flex gap-3 py-2 overflow-x-auto scroll-smooth w-full scrollbar-hide"
            >
              {data.image.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setImage(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    index === image ? "border-blue-200" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-80"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleScrollRight}
              className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <FaAngleRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Bên phải: Thông tin sản phẩm */}
        <div className="p-6 bg-gray-50 flex flex-col gap-32">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              {data.name}
            </h2>
            <Devider className="my-4" />

            {/* Giá */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Giá</p>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg shadow">
                {finalPrice.toLocaleString("vi-VN")} VNĐ
              </div>
            </div>
            {/* Màu sắc */}

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Màu sắc</p>
              <div className="flex gap-4 flex-wrap">
                {data.variants.map((variant) => {
                  const variantTotalStock = variant.sizes.reduce(
                    (total, size) => total + size.stock,
                    0
                  );
                  const isSelected = selectedVariant?._id === variant._id;

                  return (
                    <button
                      key={variant._id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedVariant(null);
                          setSelectedColor(null);
                          setSelectedSize(null);
                        } else {
                          setSelectedVariant(variant);
                        }
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform duration-300 ${
                        isSelected
                          ? "border-blue-500 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: variant.colorCode }}
                      title={`${variant.color} - Còn ${variantTotalStock} sản phẩm`}
                    />
                  );
                })}
              </div>
            </div>
            {/* Kích cỡ */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Kích cỡ</p>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => {
                  const isAvailable = selectedVariant?.sizes.some(
                    (variantSize) =>
                      variantSize.name === size && variantSize.stock > 0
                  );
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        if (!isAvailable) return;
                        if (isSelected) {
                          setSelectedSize(null);
                        } else {
                          setSelectedSize(size);
                        }
                      }}
                      className={`w-12 h-10 rounded-lg border transition-colors
                    ${
                      isAvailable
                        ? isSelected
                          ? "border-blue-500 scale-110 text-gray-500 hover:bg-gray-100"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        : "bg-gray-300 border-gray-300 text-gray-400"
                    }
                    `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Số lượng</p>

              <div className="flex gap-5 items-center">
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 w-fit">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3.5 pb-1 text-2xl text-gray-700 hover:bg-gray-100 border-r border-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center text-gray-700 border-0 focus:ring-0"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="px-3 pb-1 text-xl text-gray-700 hover:bg-gray-100 border-l border-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col text-sm text-green-600">
                  {selectedSize && stockBySize > 0 ? (
                    <p>{stockBySize} sản phẩm có sẵn</p>
                  ) : selectedVariant ? (
                    <p>{totalStockByVariant === 0 ? "Hết hàng"
                      : `${totalStockByVariant} sản phẩm có sẵn`}</p>
                  ) : (
                    <p>
                      {totalAllVariantsStock === 0
                        ? "Hết hàng"
                        : `${totalAllVariantsStock} sản phẩm có sẵn`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-2">
            <button
              disabled={totalAllVariantsStock === 0}
              className={`disabled:cursor-not-allowed flex-1 py-3 rounded-lg transition-colors ${
                totalAllVariantsStock === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Thêm vào giỏ hàng
            </button>

            <button
              disabled={totalAllVariantsStock === 0}
              className={`disabled:cursor-not-allowed flex-1 py-3 rounded-lg transition-colors ${
                totalAllVariantsStock === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Thiết kế
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-12">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Chi tiết về áo thun
          </h1>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Phong cách: Áo thun Unisex
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Thoải mái, đơn giản và dễ dàng phối hợp với nhiều phong cách. Được
            làm từ 100% cotton, form áo unisex phù hợp với cả nam va nữ. Đường
            may đôi chắc chắn và tăng tính thẩm mỹ
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Kích cỡ & Phom dáng
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Phom dáng tiêu chuẩn</li>
              <li>Áo unisex, phù hợp cho mọi giới tính</li>
              <li>Phù hợp với kích thước chuẩn</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Chất liệu & Bảo quản
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>100% cotton</li>
              <li>Viền tay và thân áo được khâu hai kim chắc chắn</li>
              <li>
                Giặt áo bằng nước lạnh hoặc nước ấm để giữ màu sắc và chất liệu
                lâu bền.
              </li>
              <li>Sản phẩm made in Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Chi tiết về thiết kế
          </h1>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Cảm hứng thiết kế
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Lảm hứng từ con vật được nhiều người yêu thích - Capypara, thiết kế
            mang phong cách đơn giản nhưng không kém phần dễ thương, ngộ nghĩnh
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Kĩ thuật in (In kỹ thuật số)
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                Sử dụng công nghệ in kỹ thuật số DTG, hình ảnh được in trực tiếp
                lên áo mà không cần khuôn, giúp giữ nguyên độ sắc nét và độ chi
                tiết của thiết kế.
              </li>
              <li>
                Phương pháp in này cho phép in đa dạng màu sắc và các họa tiết
                phức tạp, thích hợp cho các thiết kế có độ chi tiết cao.
              </li>
              <li>
                Mực in bám chắc vào vải và có độ bền cao, cho phép áo thun giữ
                màu sắc tươi sáng qua nhiều lần giặt.
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Bảo quản</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                Không dùng chất tẩy rửa mạnh, tránh chà xát quá mạnh lên bề mặt
                in.
              </li>
              <li>
                Phơi áo ở nơi thoáng mát, tránh ánh nắng trực tiếp quá lâu vì có
                thể làm mờ hình in.
              </li>
              <li>
                Ủi áo từ mặt trái và tránh ủi trực tiếp lên bề mặt in để tránh
                làm hỏng hình in.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
