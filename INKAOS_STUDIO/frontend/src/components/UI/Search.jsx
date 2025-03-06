import React from 'react'
import { IoMdSearch } from "react-icons/io";
const Search = () => {
  return (
    <div className='text-neutral-400 flex justify-between items-center bg-white min-w-[300px] lg:min-w-[420px] h-10 rounded-md border-2 group focus-within:border-gray-300'>       
        <div className='w-full h-full'>
            <input 
                type="text"
                placeholder='Search item here'
                className='w-full h-full p-2 outline-none' 
            />
        </div>

        <div className='bg-primary-darker h-full w-1/7 rounded-r flex justify-center items-center group-focus-within:text-[#fad02c]'>
            <button className=''>
                <IoMdSearch size={22}/>
            </button>
        </div>
    </div>
    
  )
}

export default Search