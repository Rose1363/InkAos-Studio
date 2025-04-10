import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loading from "../components/UI/Loading";
import { useParams } from "react-router-dom";
import ItemCard from "../components/UI/ItemCard";
import banner3 from '../assets/banner3.jpeg';

const ProductList = () => {
  const { category } = useParams();
  const id = category?.split("-")?.slice(-1)[0] || null;
  const categoryName = category?.split("-").slice(0, -1).join(" ") || "Danh mục";

  const [sortOrder, setSortOrder] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicItems = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getPublicItems,
        params: { categoryId: id },
      });

      if (response.data.success) {
        setItems(response.data.data);
      } else {
        toast.error(response.data.message || "Không thể tải danh sách sản phẩm!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải danh sách sản phẩm!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortPrice = (order) => {
    if (!order) {
      fetchPublicItems();
      return;
    }

    const sortedItems = [...items].sort((a, b) => {
      const priceA = a.totalPrice || 0;
      const priceB = b.totalPrice || 0;
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });

    setItems(sortedItems);
  };

  useEffect(() => {
    fetchPublicItems();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
        <img src={banner3} alt="Banner" className="w-full object-cover max-h-[300px]" />
      </div>
       <div className="bg-amber-50 py-7">
       <h1 className=" text-4xl font-extrabold text-center text-gray-800 mb-6 bg-amber-50">
        Danh sách sản phẩm - {categoryName}
      </h1>

      <div className="flex justify-end mb-6 mr-10">
        <div className="flex items-center space-x-3">
          <label className="text-gray-700 font-medium">Sắp xếp theo giá:</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              handleSortPrice(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- Chọn --</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm nào để hiển thị.</p>
      ) : (
        <div className="bg-gray-700 p-10 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
       </div>
      
  );
};

export default ProductList;
