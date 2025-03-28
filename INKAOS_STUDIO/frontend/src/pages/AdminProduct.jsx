import React, { useEffect, useState } from "react";
import AddProduct from "../components/UI/AddProduct";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/UI/Loading";
import AdminCardProduct from "../components/UI/AdminCardProduct";
const AdminProduct = () => {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
      });
      if (response.data.success) {
        setProductData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(productData)
  useEffect(() => {
    fetchProduct();
  }, []);
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
      {loading && <Loading size="large"/>}

      <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {
        productData.map((product,index)=>(
          <div className="">
            <AdminCardProduct data={product}/>
          </div>
        ))
      }
      </div>

      </div>
      {openAddProduct && <AddProduct close={() => setOpenAddProduct(false)} />}
    </section>
  );
};

export default AdminProduct;
