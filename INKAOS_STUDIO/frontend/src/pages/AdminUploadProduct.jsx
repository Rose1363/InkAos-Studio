import React, { useState } from 'react'
import AddProduct from '../components/UI/AddProduct';

const AdminUploadProduct = () => {
   const [openAddProduct, setOpenAddProduct] = useState(false);
   const [loading, setLoading] = useState(false);
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

    {
      openAddProduct && (<AddProduct close={()=>setOpenAddProduct(false)}/>)
    }
   </section>
  )
}

export default AdminUploadProduct