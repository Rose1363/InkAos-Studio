import React, { useEffect, useRef, useState } from "react";
import CardLoading from "../components/UI/CardLoading";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CardProduct from "../components/UI/CardProduct";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const containerRef = useRef(); // Tham chiếu đến danh sách sản phẩm

  const fetchCategoryWiseProduct = async () => {
    if (!id) return; // Kiểm tra id hợp lệ trước khi gọi API
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id }, // Đúng cách truyền id vào body request
      });

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [id]); // Thêm id vào dependency để fetch lại khi id thay đổi

  const loadingCardNumber = new Array(8).fill(null);

  // Hàm cuộn danh sách sản phẩm
  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  return (
    <div className="my-3 container mx-auto">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h3 className="text-white">{name}</h3>
        <Link to="" className="text-white">
          See All
        </Link>
      </div>

      <div className="relative mx-4">
        <div
          ref={containerRef} // Gán ref vào danh sách sản phẩm
          className="flex  overflow-hidden gap-5 scroll-smooth"
        >
          {/* Hiển thị loading */}
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategoryWiseProductDisplay" + index} />
            ))}

          {/* Hiển thị danh sách sản phẩm */}
          {!loading && products.length > 0 ? (
            products.map((p, index) => (
              <CardProduct product={p} key={p._id + "CategoryWiseProductDisplay" + index} />
            ))
          ) : (
            !loading && <p className="text-white">Không có sản phẩm nào</p>
          )}
        </div>

        {!loading && products.length > 0 &&
        <div className="absolute w-full flex justify-between top-1/2 -translate-y-1/2 px-4">
          <button
            aria-label="Scroll left"
            onClick={handleScrollLeft}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-slate-200"
          >
            <FaAngleLeft />
          </button>
          <button
            aria-label="Scroll right"
            onClick={handleScrollRight}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-slate-200"
          >
            <FaAngleRight />
          </button>
        </div>
        }
        
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
