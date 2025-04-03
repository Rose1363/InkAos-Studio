import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loading from "../components/UI/Loading";
import { useParams } from "react-router-dom";
import ItemCard from "../components/UI/ItemCard";

const ProductList = () => {
  const { category } = useParams();
  const id = category?.split("-")?.slice(-1)[0] || null;
  const categoryName = category?.split("-").slice(0, -1).join(" ") || "Danh mục";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
console.log(items)
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

  useEffect(() => {
    fetchPublicItems();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm - {categoryName}</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;