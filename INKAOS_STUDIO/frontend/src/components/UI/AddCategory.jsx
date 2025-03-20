import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const AddCategory = ({ close }) => {

    const [data, setData] = useState({
        name : "",
        image : ""
    })
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  };
  return (
    <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl">
        <div className="flex justify-between shadow-md p-5 text-xl">
          <h2 className="font-semibold">Thêm danh mục mới</h2>
          <button onClick={close}>
            <IoCloseOutline
              size={30}
              className="text-gray-600 hover:text-gray-800"
            />
          </button>
        </div>

        <form onClick={(e)=>e.preventDefault} className="p-4">
          <div className="grid gap-1">
            <label htmlFor="categoryName">
              Tên danh mục </label>
              <input
                type="text"
                id="categoryName"
                placeholder="Nhập tên danh mục"
                value={data.name}
                name="name"
                onChange={handleOnChange}
                className="border border-gray-200 focus-within:border-gray-600 outline-none p-1 rounded"
              />
           
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
