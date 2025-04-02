import React, { useMemo } from "react";
import { FaMoneyCheck } from "react-icons/fa";

const PriceDisplay = ({ selectedProduct, designData, selectedVariant, selectedSize }) => {
  const priceBySize = useMemo(
    () => selectedVariant?.sizes.find((size) => size.name === selectedSize)?.price || 0,
    [selectedVariant, selectedSize]
  );
  const finalPrice = useMemo(
    () => (selectedProduct?.basePrice || 0) + priceBySize + (designData?.basePrice || 0),
    [selectedProduct, priceBySize, designData]
  );

  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-600 mb-3">Giá sản phẩm</p>
      <div className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-2.5 rounded-lg border border-green-200">
       
        {finalPrice.toLocaleString("vi-VN")}₫
        {(priceBySize > 0 || designData?.basePrice > 0) && (
          <p className="text-xs text-gray-500 py-1">
            (Giá gốc: {selectedProduct?.basePrice?.toLocaleString("vi-VN")}₫
            {priceBySize > 0 && <> + {priceBySize.toLocaleString("vi-VN")}₫ phí size</>}
            {designData?.basePrice > 0 && (
              <> + {designData.basePrice.toLocaleString("vi-VN")}₫ phí thiết kế</>
            )}
            )
          </p>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;