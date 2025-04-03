import React, { useEffect, useState } from "react";
import AddStyleDesign from "../components/UI/AddStyleDesign";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import NoData from "../components/UI/NoData"; // Component hiển thị khi không có dữ liệu
import { BiEdit } from "react-icons/bi";
import { FcDeleteDatabase, FcDeleteRow } from "react-icons/fc";
import { LuDelete } from "react-icons/lu";
import Loading from "../components/UI/Loading";

const AdminStyleDesign = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [styleDesignData, setStyleDesignData] = useState([]);

  const fetchStyleDesign = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getStyleDesign,
      });
      if (response.data.success) {
        setStyleDesignData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyleDesign();
  }, []);

  //   console.log(subCategoryData);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh mục sản phẩm</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm danh mục
        </button>
      </div>

      {!styleDesignData[0] && !loading && <NoData />}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {styleDesignData.map((style, index) => (
          <div
            key={index}
            className="grid items-center justify-center gap-2"
          >
            <img
              src={style.image}
              alt={style.name}
              className="w-30 h-30 rounded-full object-fill border border-gray-200"
            />

            <p className="text-sm font-medium text-center">{style.name}</p>
          </div>
        ))}
      </div>

      {loading && <Loading size="large"/>}
      {openAddSubCategory && (
        <AddStyleDesign
          fetchData={fetchStyleDesign}
          close={() => setOpenAddSubCategory(false)}
        />
      )}
    </section>
  );
};

export default AdminStyleDesign;
