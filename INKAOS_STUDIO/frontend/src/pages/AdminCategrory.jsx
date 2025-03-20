import React, { useEffect, useState } from "react";
import AddCategory from "../components/UI/AddCategory";
import Loading from "../components/UI/Loading";
import emptyBox from "../assets/emptyBox.jpeg";
import NoData from "../components/UI/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
const AdminCategrory = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      // console.log(response.data.data);

      if (response.data.success) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh mục sản phẩm</h2>
        <button
          onClick={() => setOpenAddCategory(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm danh mục
        </button>
      </div>

      {!categoryData[0] && !loading && <NoData />}
      <div className="p-4 flex md:gap-3 lg:gap-5 ">
      {categoryData.map((category, index) => (
        <div
          key={index}
          className="grid items-center gap-2 p-2 shadow bg-white rounded-lg w-36"
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-scale-down border border-gray-200"
          />

          <p className="text-sm font-medium text-center">{category.name}</p>
        </div>
      ))}
      </div>

      {loading && <Loading />}
      {openAddCategory && (
        <AddCategory fetchData={fetchCategory} close={() => setOpenAddCategory(false)} />
      )}
    </section>
  );
};

export default AdminCategrory;
