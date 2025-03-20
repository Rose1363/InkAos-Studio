import React, { useState } from 'react'
import AddSubCategory from '../components/UI/AddSubCategory';

const AdminSubCategory = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
      const [loading, setLoading] = useState(false);
      const [subCategoryData, setSubCategoryData] = useState([]);
  return (
   
        <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh mục sản phẩm con</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Thêm danh mục con
        </button>
      </div>

      {
        openAddSubCategory && (
            <AddSubCategory close={()=>setOpenAddSubCategory(false)}/>
        )
      }

    </section>
  )
}

export default AdminSubCategory