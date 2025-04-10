import React from "react";
import { useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const successText = location.state?.text || "Payment"; // Kiểm tra an toàn và giá trị mặc định

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          {successText} đã đặt thành công
        </p>
        <button
          onClick={() => window.location.href = "/"} // Quay về trang chủ
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Success;