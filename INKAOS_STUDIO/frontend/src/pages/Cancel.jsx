import React from "react";

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đơn hàng đã bị hủy
        </h1>
        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn đã bị hủy thành công. Vui lòng kiểm tra lại nếu cần.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Cancel;