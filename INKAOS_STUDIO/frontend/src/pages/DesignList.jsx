import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CardProduct from "../components/UI/CardProduct";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "../components/UI/CardLoading";
import DesignCard from "../components/UI/DesignCard";
import banner5 from "../assets/banner5.png"
const DesignList = () => {
  const { style } = useParams();
  
  const id = style?.split("-")?.slice(-1)[0] || null;
 
  const categoryName = style?.split("-").slice(0, -1).join(" ") || "Danh mục";
 
  const [design, setDesign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12; // Số sản phẩm mỗi trang

  const fetchDesignByStyle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getDesignByStyle,
        data: { id },
      });

      if (response.data.success) {
        const fetchedDesign = response.data.data || [];
        setDesign(fetchedDesign);
        setTotalPages(Math.ceil(fetchedDesign.length / itemsPerPage)); // Tính tổng số trang
      }
    } catch (error) {
      AxiosToastError(error);
      setDesign([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignByStyle();
  }, [id]);

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = design.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="px-4 grid gap-10">
        <div>
          <img src={banner5} alt=""  className="w-full h-full"/>
        </div>

        {/* Loading State */}
       <div className="container mx-auto">
       {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardLoading key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <DesignCard
                    design={product}
                    key={`${product._id}-ProductList-${index}`}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  Không có sản phẩm nào trong danh mục này.
                </p>
              )}
            </div>

            {/* Pagination */}
            {design.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`p-2 rounded-full ${
                    page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaAngleLeft size={24} />
                </button>
                <span className="text-gray-700 font-medium">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`p-2 rounded-full ${
                    page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaAngleRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
       </div>
      </div>
    </section>
  );
};


export default DesignList