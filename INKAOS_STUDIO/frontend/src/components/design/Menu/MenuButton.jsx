import React from 'react'

const MenuButton = ({icon, lable, title, onClick, hoverColor}) => {
  return (
    <button 
      className='group flex flex-col items-center mb-4'
      title={title}
      onClick={onClick}>
        <div className='flex flex-col items-center'>
            <div className={`group-hover:bg-gray-700 group-hover:text-${hoverColor} p-1.5 rounded-xl`}>
                {icon}
            </div>
            <span className=' text-xs'>{lable}</span>
        </div>
    </button>
  )
}

export default MenuButton