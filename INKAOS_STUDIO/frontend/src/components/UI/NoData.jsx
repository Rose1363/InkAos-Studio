import React from 'react'
import emptyBox from "../../assets/emptyBox.jpeg"
const NoData = () => {
  return (
    <div className='grid items-center justify-center py-16'>
        <img src={emptyBox} alt="Không có dữ liệu" className='h-38 w-40'/>
        <p className='text-gray-500 text-center'>Không có dữ liệu</p>
    </div>
  )
}

export default NoData