import React from "react";
import { Link } from "react-router-dom";
import { validURLConvert } from "../../utils/validURLConvert";

const CardProduct = ({ product }) => {
  const url = `/product/${validURLConvert(product.name)}-${validURLConvert(product._id)}`;

  return (
    <Link
      to={url}
      className="p-4 grid min-w-52 lg:w-52 md:w-44 max-w rounded-2xl bg-white shadow-md group hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-xl  transition-all duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
        />
      </div>
      <div className="py-3 text-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
      </div>
      <div className="flex justify-center items-center gap-2">
        <span className="text- font-bold text-orange-500">{product.basePrice}VND</span>
      </div>
    </Link>
  );
};

export default CardProduct;
