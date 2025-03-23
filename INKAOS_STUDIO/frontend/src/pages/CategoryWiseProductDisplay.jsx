import React, { useRef, useState } from "react";
import CardLoading from "../components/UI/CardLoading";
import testData from "../data/TestData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CardProduct from "../components/UI/CardProduct";
const CategoryWiseProductDisplay = ({loading}) => {
  const containerRef = useRef();
  const handleSrcollRight = () => {
    containerRef.current.scrollLeft += 150;
  };
  const handleSrcollLeft = () => {
    containerRef.current.scrollLeft -= 150;
  };
  return (
    <div className="my-3 container mx-auto">
      <div
        className="mx-4 flex justify-items-center items-center overflow-hidden gap-5 scroll-smooth"
        ref={containerRef}
      >
         {loading
          ? testData.map((_, index) => <CardLoading key={index} />)
          : testData.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))
        }

<div className="absolute w-full flex justify-between container mx-auto left-0 right-0">
  <button
    aria-label="Scroll left" // Mô tả chức năng của nút
    onClick={handleSrcollLeft}
    className="relative bg-white p-2 rounded-full shadow-lg hover:bg-slate-200"
  >
    <FaAngleLeft />
  </button>

  <button
    aria-label="Scroll right" // Mô tả chức năng của nút
    onClick={handleSrcollRight}
    className="relative bg-white p-2 rounded-full shadow-lg hover:bg-slate-200"
  >
    <FaAngleRight />
  </button>
</div>

      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
