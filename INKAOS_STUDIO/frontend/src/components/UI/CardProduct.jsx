import React, { useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";

const CardProduct = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
<Link
  to={`/product/${product.id}`}
  className="p-2.5 grid min-w-[180px] max-w rounded-xl bg-gray-50/90 group hover:bg-white hover:shadow-2xl transition-all duration-300"
>
  <div className="min-h-40 bg-blue-50 rounded-xl group-hover:bg-white transition-all duration-300">
    <img
      src={product.images[0]}
      alt={product.name}
      className="w-full h-full object-cover rounded-xl transition-all duration-300"
    />
  </div>
  <div className="py-3 rounded text-center">
    <h2 className="text-lg font-semibold overflow-hidden text-ellipsis line-clamp-1">
      {product.name}
    </h2>
  </div>


      <div className="flex justify-center items-center gap-3">
        <div>
          <span className="text-orange-500">{product.price}</span>
        </div>
        {/* <div className=''>
            <button 
            onClick={handleAddToCart}
            className='rounded border border-amber-300 text-xs p-1 px-2 hover:bg-amber-300 hover:text-white active:scale-95 active:rotate-1'>
                Them vao gio
            </button>
        </div> */}
      </div>
    </Link>
  );
};

export default CardProduct;
