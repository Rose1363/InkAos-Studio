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
  const [loading, setLoading] = useState(false); // Sửa giá trị ban đầu thành false
  const { fetchCartItem } = useGlobalContext();
  const handleAddToCart = async () => {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!user?._id) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      //   navigate("/login");
      return;
    }

    // Kiểm tra các giá trị cần thiết
    if (!selectedProduct || !selectedVariant || !selectedSize) {
      toast.error("Vui lòng chọn đầy đủ sản phẩm, biến thể và kích thước!");
      return;
    }

    // Tạo dữ liệu gửi đi
    const cartData = {
      userId: user._id,
      productId: selectedProduct._id,
      designId: designData._id,
      variantId: selectedVariant._id,
      size: selectedSize, // Lấy size.name thay vì toàn bộ đối tượng selectedSize
      quantity: quantity,
      price:
        (selectedProduct.basePrice || 0) +
        (selectedVariant.sizes[0].price || 0) +
        (designData.basePrice || 0),
    };

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: cartData, // Gửi trực tiếp các trường, không bọc trong cartItem
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
