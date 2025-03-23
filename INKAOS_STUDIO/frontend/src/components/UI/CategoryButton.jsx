import React from 'react'

const CategoryButton = ({ label, icon }) => {
  return (
    <div>
      <div className='flex flex-col items-center'>
        <button
          className='flex justify-center items-center bg-white rounded-full md:h-11 md:w-11 lg:h-13 lg:w-13 focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label={label} 
          tabIndex={0}       
          role="button"      
        >
          <div className="rounded-full p-1.5">
            {icon}
          </div>
        </button>
        <span className='text-xs text-white'>{label}</span>
      </div>
    </div>
  )
}

export default CategoryButton
