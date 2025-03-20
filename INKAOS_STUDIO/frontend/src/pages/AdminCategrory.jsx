import React, { useState } from 'react'
import AddCategory from '../components/UI/AddCategory';

const AdminCategrory = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh mục sản phẩm</h2>
        <button
          onClick={()=>setOpenAddCategory(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm danh mục
        </button>
      </div>

      {
        openAddCategory && (
          <AddCategory close={()=>setOpenAddCategory(false)}/>
        )
      }
    </section>
  )
}

export default AdminCategrory