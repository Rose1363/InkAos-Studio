import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { FaPalette } from "react-icons/fa";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import AddToCartButton from "../components/UI/AddToCartButton";

const ItemDisplay = () => {
  const { item } = useParams();
  const navigate = useNavigate();

  const parts = item?.split("-") || [];

  const categoryId = parts[0]; // "67dc08f3a4a6059ecf3fb313"
  const designId = parts.length > 0 ? parts[parts.length - 1] : null; // "67eacbf4fa8cc03ecd789a2f"
  const colorCode = parts.length > 2 ? parts[parts.length - 2] : null; // "#ec55bc"

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
  const [category, setCategory] = useState(categoryId);

  const fetchDesignDetail = useCallback(async () => {
    if (!designId) {
      setError("Không có designId được cung cấp.");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.getDesignDetail,
        data: { designId }, // Nếu API dùng GET, sửa thành params: { designId }
      });
      console.log("Design API Response:", response.data.data);
      if (response.data.success && response.data.data) {
        setDesignData({
          name: response.data.data.name || "Thiết kế không tên",
          thumbnail:
            response.data.data.thumbnail || "https://via.placeholder.com/400",
          basePrice: response.data.data.basePrice || 0,
          elements: response.data.data.elements || [],
          _id: response.data.data._id,
          isPublic:
            response.data.data.isPublic !== undefined
              ? response.data.data.isPublic
              : true,
        });
      } else {
        setError(response.data.message || "Dữ liệu thiết kế không hợp lệ.");
      }
    } catch (err) {
      console.error("Fetch Design Error:", err);
      if (err.response) {
        setError(
          err.response.data.message || "Lỗi từ server khi tải thiết kế."
        );
      } else if (err.request) {
        setError("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
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
        const fetchedProducts = response.data.data || [];
        setProducts(fetchedProducts);
        // Tự động chọn variant khớp với colorCode từ URL
        if (fetchedProducts.length > 0 && colorCode) {
          const product = fetchedProducts[0];
          const variant =
            product.variants.find((v) => v.colorCode === colorCode) ||
            product.variants[0];
          setSelectedProduct(product);
          setSelectedVariant(variant);
        }
      } else {
        toast("Không tìm thấy sản phẩm trong danh mục này.");
      }
    } catch (error) {
      AxiosToastError(error);
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
  }, [fetchDesignDetail, fetchProductsByCategory]);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      handleProductSelect(products[0]);
    }
  }, [products, selectedProduct, handleProductSelect]);

  const handleCustomize = () => {
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
              <label
                htmlFor="productCategory"
                className="text-sm font-medium text-gray-700"
              >
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
              <ProductWiseCatgory
                products={products}
                onProductSelect={handleProductSelect}
                selectedProduct={selectedProduct}
              />
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
            <AddToCartButton
              quantity={quantity}
              designData={designData}
              selectedProduct={selectedProduct}
              selectedVariant={selectedVariant}
              selectedSize={selectedSize}
            />
            <button
              onClick={handleCustomize}
              disabled={
                !selectedProduct ||
                selectedProduct.variants.every((v) =>
                  v.sizes.every((s) => s.stock === 0)
                )
              }
              className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                !selectedProduct ||
                selectedProduct.variants.every((v) =>
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
    </section>
  );
};

export default ItemDisplay;
