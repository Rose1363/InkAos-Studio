import React, { useEffect, useMemo } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantitySelector = ({
  selectedProduct,
  selectedVariant,
  selectedSize,
  quantity,
  setQuantity,
}) => {
  const totalStockByVariant = useMemo(
    () =>
      selectedVariant?.sizes.reduce((total, size) => total + size.stock, 0) ||
      0,
    [selectedVariant]
  );
  const stockBySize = useMemo(
    () =>
      selectedVariant?.sizes.find((size) => size.name === selectedSize)
        ?.stock || 0,
    [selectedVariant, selectedSize]
  );
  const totalAllVariantsStock = useMemo(
    () =>
      selectedProduct?.variants.reduce(
        (total, variant) =>
          total + variant.sizes.reduce((sum, size) => sum + size.stock, 0),
        0
      ) || 0,
    [selectedProduct]
  );
  useEffect(() => {
    if (selectedVariant || selectedSize) {
      setQuantity(1);
    }
  }, [selectedVariant, selectedSize, setQuantity]);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-600 mb-3">Số lượng</p>
      <div className="flex gap-6 items-center">
        <div className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={decreaseQuantity}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-l-xl transition-colors duration-200"
            disabled={quantity === 1}
          >
            <FaMinus />
          </button>
          <input
            disabled={!selectedProduct || !selectedSize || !selectedVariant}
            type="text"
            value={quantity}
            readOnly
            className="w-16 text-center text-gray-800 bg-transparent border-0 focus:ring-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={increaseQuantity}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-r-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !selectedProduct ||
              !selectedSize ||
              !selectedVariant ||
              quantity === stockBySize ||
              (stockBySize === 0 && quantity === totalStockByVariant) ||
              (totalStockByVariant === 0 && quantity === totalAllVariantsStock)
            }
          >
            <FaPlus />
          </button>
        </div>
        <div className="text-sm text-indigo-600 font-medium">
          {selectedSize && stockBySize > 0 ? (
            <p>{stockBySize} sản phẩm có sẵn</p>
          ) : selectedVariant ? (
            <p>
              {totalStockByVariant === 0
                ? "Hết hàng"
                : `${totalStockByVariant} sản phẩm có sẵn`}
            </p>
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
  );
};

export default QuantitySelector;
