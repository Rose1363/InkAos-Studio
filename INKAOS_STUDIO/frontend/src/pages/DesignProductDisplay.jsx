import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductImageGallery from "../components/UI/ProductImageGallery";
import VariantSelector from "../components/UI/VariantSelector";
import SizeSelector from "../components/UI/SizeSelector";
import QuantitySelector from "../components/UI/QuantitySelector";
import PriceDisplay from "../components/UI/PriceDisplay";
import ProductWiseCatgory from "../components/UI/ProductWiseCatgory";
import Loading from "../components/UI/Loading";
import Devider from "../components/UI/Devider";
import { FaPalette, FaShoppingCart } from "react-icons/fa";

const DesignProductDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Thêm navigate để điều hướng
  const designId = id?.split("-")?.slice(-1)[0] || null;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designData, setDesignData] = useState({
    name: "",
    thumbnail: "",
    basePrice: 0,
    isPublic: true,
  });
  const allCategory = useSelector((state) => state.product.allCategory);
  const [category, setCategory] = useState(allCategory[0]?._id || null);

  const fetchDesignDetail = useCallback(async () => {
    if (!designId) return;
    try {
      const response = await Axios({
        ...SummaryApi.getDesignDetail,
        data: { designId },
      });
      if (response.data.success && response.data.data) {
        setDesignData({
          name: response.data.data.name || "Thiết kế không tên",
          thumbnail: response.data.data.thumbnail || "https://via.placeholder.com/400",
          basePrice: response.data.data.basePrice || 0,
          elements: response.data.data.elements || [], // Thêm elements để gửi sang Design
          _id: response.data.data._id, // Thêm _id để cập nhật
          isPublic: response.data.data.isPublic !== undefined ? response.data.data.isPublic : true, // Thêm isPublic
       
        });
      }
    } catch (err) {
      setError("Không thể tải thông tin thiết kế. Vui lòng thử lại.");
    }
  }, [designId]);

  const fetchProductsByCategory = useCallback(async () => {
    if (!category) {
      setProducts([]);
      return;
    }
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id: category },
      });
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setError("Không tìm thấy sản phẩm trong danh mục này.");
      }
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
    setSelectedVariant(product?.variants[0] || null);
    setSelectedSize(null);
    setQuantity(1);
    setImageIndex(0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDesignDetail(), fetchProductsByCategory()]);
      setLoading(false);
    };
    loadData();
  }, [designId, fetchDesignDetail, fetchProductsByCategory]);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      handleProductSelect(products[0]);
    }
  }, [products, selectedProduct, handleProductSelect]);

  // Xử lý nút Tùy chỉnh
  const handleCustomize = () => {
    console.log("designToEdit", designData)
    navigate("/design", { state: { designToEdit: designData } });
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

  return (
    <section className="container mx-auto py-8 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-lg overflow-hidden">
        <ProductImageGallery
          selectedProduct={selectedProduct}
          designData={designData}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          selectedVariant={selectedVariant}
        />
        <div className="p-8 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {selectedProduct?.name} thiết kế {designData.name}
            </h2>
            <Devider className="my-6 border-gray-200" />
            <PriceDisplay
              selectedProduct={selectedProduct}
              designData={designData}
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
            />
            <div className="grid gap-2 mb-6">
              <label htmlFor="productCategory" className="text-sm font-medium text-gray-700">
                Chọn danh mục
              </label>
              <select
                name="category"
                id="productCategory"
                className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                onChange={(e) => setCategory(e.target.value)}
                value={category || ""}
              >
                {allCategory.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ProductWiseCatgory products={products} onProductSelect={handleProductSelect} />
            </div>
            <VariantSelector
              selectedProduct={selectedProduct}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              setSelectedSize={setSelectedSize}
            />
            <SizeSelector
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
            <QuantitySelector
              selectedProduct={selectedProduct}
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
          <div className="flex gap-4">
            <button
              disabled={!selectedProduct || selectedProduct.variants.every(v => v.sizes.every(s => s.stock === 0))}
              className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                !selectedProduct || selectedProduct.variants.every(v => v.sizes.every(s => s.stock === 0))
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <FaShoppingCart /> Thêm vào giỏ
            </button>
            <button
              onClick={handleCustomize} // Thêm sự kiện onClick
              disabled={!selectedProduct || selectedProduct.variants.every(v => v.sizes.every(s => s.stock === 0))}
              className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                !selectedProduct || selectedProduct.variants.every(v => v.sizes.every(s => s.stock === 0))
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaPalette /> Tùy chỉnh
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignProductDisplay;