import React from 'react'

const CardLoading = () => {
  return (
    <div  className='bg-white p-2 grid min-w-45 max-w rounded border border-gray-100 shadow-xl gap-2 animate-pulse'>
      {/* Hiển thị hình ảnh đầu tiên */}
      <div className='min-h-40 bg-blue-50 rounded'> 
      </div>
      {/* Hiển thị tên sản phẩm */}
      <div className='p-3 rounded bg-blue-50 h-8 w-2/3'>
      </div>
      {/* Hiển thị giá sản phẩm */}
      

    <div className='flex justify-between items-center gap-3'>
        <div className='p-3 rounded bg-blue-50 w-1/3 h-8'>
            
        </div>
        <div className='p-3 rounded bg-blue-50 w-2/3 h-8'>
           
        </div>
    </div>
    </div>
  )
}

export default CardLoading