import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import VariantSelector from "../components/UI/VariantSelector";
import SizeSelector from "../components/UI/SizeSelector";
import QuantitySelector from "../components/UI/QuantitySelector";
import PriceDisplay from "../components/UI/PriceDisplay";
import Loading from "../components/UI/Loading";
import Devider from "../components/UI/Devider";
import { FaAngleLeft, FaAngleRight, FaPalette } from "react-icons/fa";
import AxiosToastError from "../utils/AxiosToastError";
import AddToCartButton from "../components/UI/AddToCartButton";

const ProductDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const allCategory = useSelector((state) => state.product.allCategory); // Lấy allCategory từ Redux

  const productId = id?.split("-")?.slice(-1)[0] || null;

  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designData, setDesignData] = useState(null);

  const fetchProductDetail = useCallback(async () => {
    if (!productId) {
      setError("Không có productId được cung cấp.");
      return;
    }
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetail,
        data: { productId },
      });
      if (response.data.success && response.data.data) {
        const fetchedProduct = response.data.data;
        setProduct({
          _id: fetchedProduct._id,
          name: fetchedProduct.name || "Sản phẩm không tên",
          image: fetchedProduct.image || [],
          variants: fetchedProduct.variants || [],
          basePrice: fetchedProduct.basePrice || 0,
          categoryId: fetchedProduct.categoryId, // Lưu categoryId nếu có
        });
        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }
      } else {
        setError(response.data.message || "Dữ liệu sản phẩm không hợp lệ.");
      }
    } catch (err) {
      console.error("Fetch Product Error:", err);
      AxiosToastError(err);
      setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleCustomize = () => {
    const defaultCategoryId = allCategory[0]?._id || null; // Lấy categoryId mặc định từ Redux
    navigate("/design", { 
      state: { 
        productId: product._id,
        categoryId: product.categoryId || defaultCategoryId, // Ưu tiên categoryId từ product, nếu không thì từ Redux
        colorCode: selectedVariant?.colorCode || "#000000",
        designToEdit: designData
      } 
    });
  };
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-600 text-center">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-gray-600 text-center">
        Không tìm thấy sản phẩm.
      </div>
    );
  }
  const handleScrollLeft = () => imageContainer.current.scrollLeft -= 150;
  const handleScrollRight = () => imageContainer.current.scrollLeft += 150;

  return (
    <section className="container mx-auto py-8 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-lg overflow-hidden">
        {/* Phần hình ảnh sản phẩm */}
        <div className="p-6 bg-gray-50">
             <div className="relative w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
               <div className="relative w-full h-full flex items-center bg-[#f5f5f5] justify-center">
              
               <img src={product.image} alt="" className="object-cover" />

              
               
               </div>
             </div>
             <div className="flex items-center justify-center gap-2 my-4">
               
             </div>
             <div className="relative flex items-center">
               <button
                 onClick={handleScrollLeft}
                 className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
               >
                 <FaAngleLeft className="text-gray-700" />
               </button>
              
               <button
                 onClick={handleScrollRight}
                 className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
               >
                 <FaAngleRight className="text-gray-700" />
               </button>
             </div>
           </div>

        {/* Phần thông tin sản phẩm */}
        <div className="p-8 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {product.name}
            </h2>
            <Devider className="my-6 border-gray-200" />

            {/* Hiển thị giá */}
            <PriceDisplay
              selectedProduct={product}
              designData={designData} // null trong trường hợp này
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
            />

            {/* Chọn biến thể (màu sắc) */}
            <VariantSelector
              selectedProduct={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              setSelectedSize={setSelectedSize}
            />

            {/* Chọn kích thước */}
            <SizeSelector
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />

            {/* Chọn số lượng */}
            <QuantitySelector
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4">
            <AddToCartButton
              quantity={quantity}
              designData={designData} // null trong trường hợp này
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
            />
            <button
              onClick={handleCustomize}
              disabled={
                !product ||
                product.variants.every((v) =>
                  v.sizes.every((s) => s.stock === 0)
                )
              }
              className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                !product ||
                product.variants.every((v) =>
                  v.sizes.every((s) => s.stock === 0)
                )
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaPalette /> Tùy chỉnh
            </button>
          </div>
        </div>
      </div>

      {/* Phần chi tiết sản phẩm */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Chi tiết về áo thun
          </h1>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Phong cách: Áo thun Unisex
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Thoải mái, đơn giản và dễ dàng phối hợp với nhiều phong cách. Được
            làm từ 100% cotton, form áo unisex phù hợp với cả nam và nữ. Đường
            may đôi chắc chắn và tăng tính thẩm mỹ.
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

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Chi tiết về thiết kế
          </h1>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Cảm hứng thiết kế
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Lấy cảm hứng từ con vật được nhiều người yêu thích - Capybara, thiết kế
            mang phong cách đơn giản nhưng không kém phần dễ thương, ngộ nghĩnh.
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Kỹ thuật in (In kỹ thuật số)
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