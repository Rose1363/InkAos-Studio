import React, { useEffect, useState } from "react";
import AddProduct from "../components/UI/AddProduct";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/UI/Loading";
import AdminCardProduct from "../components/UI/AdminCardProduct";
import { BiSearch } from "react-icons/bi";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import NoData from "../components/UI/NoData";
const AdminProduct = () => {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page,
          limit: 10,
          search,
        },
      });
      if (response.data.success) {
        setProductData(response.data.data);
        setTotalPageCount(response.data.totalNoPage || 1);
        
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại khi page hoặc search thay đổi
  useEffect(() => {
    fetchProduct();
  }, [page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProduct();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);
  // Xử lý thay đổi tìm kiếm
  const handleOnChange = (e) => {
    const { value } = e.target;
    setPage(1); // Reset về trang 1 khi tìm kiếm
    setSearch(value);
  };

  const handleNext = () => {
    if (page < totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh mục sản phẩm</h2>
        <button
          onClick={() => setOpenAddProduct(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="px-3">
        <input
          type="text"
          value={search}
          onChange={handleOnChange}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full p-2 mb-4 outline-none border border-gray-300 focus-within:border-primary rounded-md"
        />
      </div>

      {loading ? (
          <Loading size="large" />
        ) : productData.length === 0 ? (
          <NoData />
        ) : (
          <>
            <div className="min-h-[65vh]">
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {productData.map((product) => (
                  <AdminCardProduct key={product._id} data={product} />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-4">
              <button
                onClick={handlePrevious}
                className="p-2 border border-amber-300 hover:bg-amber-300 text-amber-300 hover:text-white disabled:opacity-50 disabled:bg-gray-500  disabled:text-white disabled:border-gray-300 disabled:cursor-not-allowed"
                disabled={page === 1}
              >
                <GrCaretPrevious size={20} />
              </button>
              <span className="text-lg font-semibold text-gray-700">
                {page} / {totalPageCount}
              </span>
              <button
                onClick={handleNext}
                className="p-2 border border-amber-300 hover:bg-amber-300 text-amber-300 hover:text-white disabled:opacity-50 disabled:bg-gray-500  disabled:text-white disabled:border-gray-300 disabled:cursor-not-allowed"
                disabled={page === totalPageCount}
              >
                <GrCaretNext size={20} />
              </button>
            </div>
          </>
        )}

      {openAddProduct && <AddProduct close={() => setOpenAddProduct(false)} />}
    </section>
  );
};

export default AdminProduct;
