import React, { useState } from "react";
import Loading from "./Loading";
import toast from "react-hot-toast";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { useGlobalContext } from "../../provider/GlobalProvider";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import Axios from "../../utils/Axios";

const AddToCartButton = ({
  selectedProduct,
  selectedVariant,
  selectedSize,
  designData,
  quantity,
}) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { fetchCartItem } = useGlobalContext();

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (!selectedProduct || !selectedVariant || !selectedSize) {
      toast.error("Vui lòng chọn đầy đủ sản phẩm, biến thể và kích thước!");
      return;
    }

    // Tìm giá của kích thước được chọn
    const sizePrice = selectedVariant.sizes.find((s) => s.name === selectedSize)?.price || 0;

    const cartData = {
      userId: user._id,
      productId: selectedProduct._id,
      designId: designData?._id || null, // Đảm bảo designId là null nếu không có
      variantId: selectedVariant._id,
      size: selectedSize,
      quantity: quantity,
      price:
        ((selectedProduct.basePrice || 0) +
         sizePrice +
         (designData?.basePrice || 0)) * quantity, // Tổng giá nhân với quantity
    };

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: cartData,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={
        loading ||
        !selectedProduct ||
        !selectedVariant ||
        !selectedSize ||
        selectedProduct.variants.every((v) =>
          v.sizes.every((s) => s.stock === 0)
        )
      }
      className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
        loading ||
        !selectedProduct ||
        !selectedVariant ||
        !selectedSize ||
        selectedProduct.variants.every((v) =>
          v.sizes.every((s) => s.stock === 0)
        )
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      {loading ? (
        <Loading size="small" />
      ) : (
        <div className="flex items-center gap-2">
          <FaShoppingCart /> Thêm vào giỏ
        </div>
      )}
    </button>
  );
};

export default AddToCartButton;