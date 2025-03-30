import React from "react";

const AdminCardProduct = ({ data }) => {
  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-50 border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div>
        <img
          src={data?.image[0]}
          alt={data.name}
          className=" w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="mb-3">
        <p
          className="text-center font-semibold text-sm text-gray-800 truncate"
          title={data?.name}
        >
          {data?.name}
        </p>
        <div className="flex gap-3">
          <p className="text-center font-bold text-md text-primary mt-1">
            {formatPrice(data?.basePrice)}
          </p>
          <p className="text-center font-bold text-md text-primary mt-1">
            {data?.totalStock}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminCardProduct;
