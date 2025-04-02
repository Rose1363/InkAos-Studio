import React from "react";

const VariantSelector = ({ selectedProduct, selectedVariant, setSelectedVariant, setSelectedSize }) => {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-600 mb-3">Màu sắc</p>
      <div className="flex flex-wrap gap-3">
        {selectedProduct?.variants?.map((variant) => {
          const variantTotalStock =
            variant.sizes?.reduce((total, size) => total + (size.stock || 0), 0) || 0;
          const isSelected = selectedVariant?._id === variant._id;
          return (
            <button
              key={variant._id}
              onClick={() => {
                if (isSelected) {
                  setSelectedVariant(null);
                  setSelectedSize(null);
                } else {
                  setSelectedVariant(variant);
                  setSelectedSize(null);
                }
              }}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                isSelected ? "border-blue-600 ring-2 ring-blue-300 scale-105" : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: variant.colorCode || "#cccccc" }}
              title={`${variant.color} - Còn ${variantTotalStock} sản phẩm`}
            >
              {isSelected && <span className={`w-3 h-3 rounded-full ${variant.colorCode === '#ffffff' ? "bg-black": "bg-white"}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;