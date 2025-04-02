import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaMinus, FaPlus } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const DesignDisplay = () => {
  const { id } = useParams(); // Lấy id từ URL
  
  const designId = id?.split("-")?.slice(-1)[0] || null; // Tách designId
  const [data, setData] = useState({
    name: "",
    thumbnail: "",
    basePrice: 0,
   
  });

//   console.log(designId)
  const [loading, setLoading] = useState(true); // Khởi tạo loading = true
  const [quantity, setQuantity] = useState(1);
  const imageContainer = useRef();

  const fetchProductDetail = async () => {
    if (!designId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getDesignDetail,
        data: { designId },
      });
      if (response.data.success && response.data.data) {
        setData({
          name: response.data.data.name || "Thiết kế không tên",
          thumbnail: response.data.data.thumbnail || "https://via.placeholder.com/400",
          basePrice: response.data.data.basePrice || 0,
          elements: response.data.data.elements || [],
        });
      } else {
        throw new Error(response.data.message || "Không tìm thấy thiết kế");
      }
    } catch (error) {
      AxiosToastError(error); // Gọi hàm xử lý lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [designId]);

  const handleScrollLeft = () => {
    if (imageContainer.current) imageContainer.current.scrollLeft -= 150;
  };

  const handleScrollRight = () => {
    if (imageContainer.current) imageContainer.current.scrollLeft += 150;
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  return (
    <section className="container mx-auto py-8 px-4 lg:px-0 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Bên trái: Ảnh sản phẩm */}
        <div className="p-6 bg-gray-50">
          <div className="relative w-full h-[50vh] lg:h-[60vh] bg-white rounded-xl overflow-hidden shadow-md">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
                <p className="text-gray-500">Đang tải...</p>
              </div>
            ) : (
              <img
                src={data.thumbnail || "https://via.placeholder.com/400"}
                alt={data.name || "Thiết kế"}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            )}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default DesignDisplay;