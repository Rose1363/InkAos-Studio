import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import AdminCardDesign from "../components/UI/AdminCardDesign";
import Loading from "../components/UI/Loading";
import NoData from "../components/UI/NoData";
import { BiSearch } from "react-icons/bi";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
const AdminDesignList = () => {
  const [loading, setLoading] = useState(false);
  const [designData, setDesignData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchDesign = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getDesign,
        data: {
          page: page,
          limit: 10,
          search: search,
        },
      });
      if (response.data.success) {
        setDesignData(response.data.data);
        setTotalPageCount(response.data.totalNoPage || 1);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchDesign khi page thay đổi
  useEffect(() => {
    fetchDesign();
  }, [page]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDesign();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

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

  const handleOnChange = (e) => {
    const { value } = e.target;
    setPage(1);
    setSearch(value);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh Sách Thiết Kế</h2>
        <div className="bg-primary flex items-center pl-3">
          <BiSearch size={20} color="white" />
          <input
            type="text"
            placeholder="Tìm kiếm thiết kế..."
            value={search}
            onChange={handleOnChange}
            className="bg-white border border-gray-200 focus-within:border-blue-200 p-2 ml-3 text-sm px-3 outline-none font-semibold"
          />
        </div>
      </div>

      <div>
        {loading ? (
          <Loading size="large" />
        ) : designData.length === 0 ? (
          <NoData />
        ) : (
          <>
            <div className="min-h-[65vh]">
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {designData.map((design) => (
                  <AdminCardDesign key={design._id} data={design} />
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
      </div>
    </section>
  );
};

export default AdminDesignList;
