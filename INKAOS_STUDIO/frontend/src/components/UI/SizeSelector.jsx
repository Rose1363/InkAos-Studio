import React from "react";

const SizeSelector = ({ selectedVariant, selectedSize, setSelectedSize }) => {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-gray-600 mb-3">Kích cỡ</p>
      <div className="flex gap-3">
        {["S", "M", "L", "XL"].map((size) => {
          const isAvailable = selectedVariant?.sizes.some(
            (variantSize) => variantSize.name === size && variantSize.stock > 0
          );
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => {
                if (!isAvailable) return;
                if (isSelected) setSelectedSize(null);
                else setSelectedSize(size);
              }}
              className={`w-14 h-12 rounded-xl border font-medium transition-all duration-300 ${
                isAvailable
                  ? isSelected
                    ? "bg-indigo-500 text-white border-indigo-500 scale-105"
                    : "border-gray-200 text-gray-800 hover:bg-gray-50"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;