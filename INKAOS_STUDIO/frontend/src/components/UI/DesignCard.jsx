import React from "react";
import { Link } from "react-router-dom";
import { validURLConvert } from "../../utils/validURLConvert";

const DesignCard = ({ design }) => {
  const url = `/design/${validURLConvert(design.name)}-${design._id}`; // URL dẫn đến chi tiết thiết kế

  return (
    <Link
      to={url}
      className="block lg:w-60 w-48 max-w-xs bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-t-2xl p-3">
        <img
          src={design.thumbnail}
          alt={design.name}
          className="w-full h-full border border-gray-300 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {design.name}
        </h2>
        {design.basePrice && (
          <span className="text-md font-bold text-orange-500">
            {design.basePrice.toLocaleString()} VND
          </span>
        )}
      </div>
    </Link>
  );
};

export default DesignCard;