import React from 'react'
import { IoExpand, IoContract } from "react-icons/io5";

const AspectRatioSettings = ({updateObject, selectedObject}) => {
    
    const handleAspectRatio = (mode) => {
        if (mode === 'fill') {
        updateObject({ scaleX: 1, scaleY: 1 }); // Reset scale để lấp đầy
        } else if (mode === 'fit') {
        updateObject({ scaleX: 0.5, scaleY: 0.5 }); // Giảm scale để vừa vùng
        }
    };

    return (
    <div >
    <label className="block mb-1">Aspect Ratio</label>
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAspectRatio('fill')}
        className={`p-1 border rounded ${selectedObject.scaleX === 1 && selectedObject.scaleY === 1 ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="Fill"
      >
       <IoExpand size={30}/>
      </button>
      <button
        onClick={() => handleAspectRatio('fit')}
        className={`p-1 border rounded ${selectedObject.scaleX === 0.5 && selectedObject.scaleY === 0.5 ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="Fit"
      >
        <IoContract size={30} />
      </button>
    </div>
  </div>
  )
}

export default AspectRatioSettings