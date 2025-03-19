import React from 'react'
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";

const RotateSettings = ({selectedObject, updateObject}) => {
    // Xử lý Rotate
  const handleRotateChange = (rotation) => {
    let normalizedRotation = ((rotation % 360) + 360) % 360;
    if (normalizedRotation > 360) normalizedRotation -= 360;
    if (normalizedRotation < -360) normalizedRotation += 360;
    console.log('New rotation:', normalizedRotation);
    updateObject({ rotation: normalizedRotation });
  };
  return (
    
    <div >
    <label className="block mb-1">Rotate</label>
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleRotateChange((selectedObject.rotation || 0) - 90)}
        className="p-1 border rounded hover:bg-gray-100"
        title="Rotate Left"
      >
        <FaArrowRotateLeft size={30} />
      </button>
      <button
        onClick={() => handleRotateChange((selectedObject.rotation || 0) + 90)}
        className="p-1 border rounded hover:bg-gray-100"
        title="Rotate Right"
      >
        
        <FaArrowRotateRight size={30} />
      </button>
      {/* <input
        type="number"
        value={selectedObject.rotation || 0}
        onChange={(e) => handleRotateChange(parseInt(e.target.value) || 0)}
        className="w-15 p-1 border rounded"
        min="-360"
        max="360"
      /> */}
    </div>
  </div>
  )
}

export default RotateSettings