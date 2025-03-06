// src/components/TShirtDesign/Options/AlignmentSettings.jsx
import React from 'react';
import { FaAlignLeft, FaAlignCenter , FaAlignRight } from "react-icons/fa6";

const AlignmentSettings = ({ selectedObject, updateObject }) => {
  const handleAlignmentChange = (align) => {
    updateObject({ align });
  };

  return (
    <div className="mb-2">
      <label className="block mb-1">Căn chỉnh</label>
      <div className="flex gap-2">
        <button
          onClick={() => handleAlignmentChange('left')}
          className={`p-2 border rounded ${selectedObject.align === 'left' ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
          title="Căn trái"
        >
          <FaAlignLeft />
        </button>
        <button
          onClick={() => handleAlignmentChange('center')}
          className={`p-2 border rounded ${selectedObject.align === 'center' ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
          title="Căn giữa"
        >
          <FaAlignCenter  />
        </button>
        <button
          onClick={() => handleAlignmentChange('right')}
          className={`p-2 border rounded ${selectedObject.align === 'right' ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
          title="Căn phải"
        >
          <FaAlignRight />
        </button>
      </div>
    </div>
  );
};

export default AlignmentSettings;