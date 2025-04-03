import React, { useRef, useMemo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ProductImageGallery = ({ selectedProduct,selectedVariant, designData, imageIndex, setImageIndex }) => {
  const imageContainer = useRef();

  const imagesWithThumbnail = useMemo(() => {
    if (!selectedProduct?.image || !designData.thumbnail) return selectedProduct?.image || [];
    return [...selectedProduct.image, designData.thumbnail];
  }, [selectedProduct, designData]);

  const handleScrollLeft = () => imageContainer.current.scrollLeft -= 150;
  const handleScrollRight = () => imageContainer.current.scrollLeft += 150;

  const backgroundColor = selectedVariant?.colorCode || "#ffffff";

  return (
    <div className="p-6 bg-gray-50">
      <div className="relative w-full h-[49vh] lg:h-[66vh] rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
        <div className="relative w-full h-full flex items-center bg-[#f5f5f5] justify-center">
          <div className="relative h-full rounded-lg overflow-hidden" style={{ backgroundColor }}>
            <img
              src={imagesWithThumbnail[imageIndex] || "https://via.placeholder.com/400"}
              alt={selectedProduct?.name || "Sản phẩm"}
              className="w-full h-full object-fill"
            />
            {imageIndex !== imagesWithThumbnail.length - 1 && designData.thumbnail && (
              <img
                src={designData.thumbnail}
                alt="Thiết kế trên sản phẩm"
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/5 w-1/2 h-auto object-contain transition-opacity duration-300"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 my-4">
        {imagesWithThumbnail.map((_, index) => (
          <div
            key={index}
            onClick={() => setImageIndex(index)}
            className={`cursor-pointer w-2.5 h-2.5 rounded transition-all duration-300 ${
              index === imageIndex ? "bg-indigo-600 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="relative flex items-center">
        <button
          onClick={handleScrollLeft}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
        >
          <FaAngleLeft className="text-gray-700" />
        </button>
        <div
          ref={imageContainer}
          className="mx-10 flex gap-4 overflow-x-auto scroll-smooth w-full scrollbar-hide"
        >
          {imagesWithThumbnail.map((img, index) => (
            <div
              key={index}
              onClick={() => setImageIndex(index)}
              className={`w-16 h-20 flex-shrink-0 rounded overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                index === imageIndex ? "border-indigo-400 shadow-md" : "border-gray-200"
              }`}
            >
              <div className="relative h-full rounded overflow-hidden" style={{ backgroundColor }}>
                <img
                  src={img || "https://via.placeholder.com/400"}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
                {index !== imagesWithThumbnail.length - 1 && designData.thumbnail && (
                  <img
                    src={designData.thumbnail}
                    alt="Thiết kế trên sản phẩm"
                    className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/5 w-1/2 h-auto object-contain transition-opacity duration-300"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleScrollRight}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
        >
          <FaAngleRight className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;