import React from "react";
import { validURLConvert } from "../../utils/validURLConvert";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  const url = `/item/${item.category}-${validURLConvert(
    item.productName
  )}-${validURLConvert(item.designName || "")}-${item.colorCode.replace(
    "#",
    "%23"
  )}-${item.designId._id}-${item.productId._id}`;
  // console.log(url);
  return (
    <Link
      to={url}
      className="border w-52 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Hiển thị hình ảnh sản phẩm với thiết kế chồng lên */}
      <div
        className="relative w-44 h-44 overflow-hidden group mx-auto"
        style={{ backgroundColor: item.colorCode || "#ffffff" }}
      >
        <img
          src={item.productImage || "https://via.placeholder.com/150"}
          alt={item.productName}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {item.designName && item.designImage && (
          <img
            src={item.designImage}
            alt={`Thiết kế ${item.designName}`}
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-1/2 h-auto object-contain transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:transform-none"
          />
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="text-center mt-2">
        <h2 className="text-lg font-semibold truncate">
          {item.productName} in hình {item.designName}
        </h2>
        <p className="text-lg font-bold text-red-600 mt-2">
          {item.totalPrice.toLocaleString()} VNĐ
        </p>
      </div>
    </Link>
  );
};

export default ItemCard;
