import React from 'react';

const MenuButton = ({ icon, label, title, onClick, hoverClass }) => {
  return (
    <button 
      className="group flex flex-col items-center mb-4"
      title={title}
      aria-label={label}  // Thêm aria-label để hỗ trợ trợ năng
      onClick={onClick}>
      
      <div className="flex flex-col items-center">
        <div className={`group-hover:bg-gray-700 ${hoverClass} p-1.5 rounded-xl`}>
          {icon}
        </div>
        <span className="text-xs">{label}</span>
      </div>
    </button>
  );
};

export default MenuButton;
