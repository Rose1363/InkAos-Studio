import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DesignCard from "../components/UI/DesignCard";
import CardLoading from "../components/UI/CardLoading";

const PublicDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchPublicDesigns();
  }, [page]);

  const fetchPublicDesigns = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getPublicDesign,
        data: { page, limit }, // Truyền page và limit vào body request
      });
      if (response.data.success) {
        setDesigns(response.data.data || []);
      }
      
    } catch (error) {
      console.error("Lỗi khi lấy designs:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pt-16 pb-28">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Thiết Kế Mới Nhất
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardLoading key={"PublicDesigns" + index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {designs.length > 0 ? (
              designs.map((design) => (
                <DesignCard key={design._id} design={design} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500 text-lg">
                Hiện tại chưa có thiết kế nào để hiển thị.
              </p>
            )}
          </div>
        )}

        {/* Pagination - Tạm thời comment */}
        {/* {!loading && designs.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Trang trước
            </button>
            <span className="text-gray-700 font-medium">Trang {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={designs.length < limit}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                designs.length < limit
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Trang sau
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PublicDesigns;
