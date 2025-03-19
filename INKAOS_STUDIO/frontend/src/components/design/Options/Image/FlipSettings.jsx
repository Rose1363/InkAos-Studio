import React from 'react'
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";

const FlipSettings = ({selectedObject, updateObject}) => {
  const handleFlip = (direction) => {
    if (direction === 'horizontal') {
      updateObject({ flipX: !selectedObject.flipX });
    } else if (direction === 'vertical') {
      updateObject({ flipY: !selectedObject.flipY });
    }
  };
  return (
    <div >
    <label className="block mb-1">Flip</label>
    <div className="flex gap-2">
      <button
        onClick={() => handleFlip('horizontal')}
        className={`p-1 border rounded ${selectedObject.flipX ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="Flip Horizontal"
      >
        <LuFlipHorizontal2 size={30} />
      </button>
      <button
        onClick={() => handleFlip('vertical')}
        className={`p-1 border rounded ${selectedObject.flipY ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="Flip Vertical"
      >
        <LuFlipVertical2 size={30}/>
      </button>
    </div>
  </div>
  )
}

export default FlipSettings