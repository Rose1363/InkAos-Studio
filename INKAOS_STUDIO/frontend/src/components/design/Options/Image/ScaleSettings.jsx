import React from 'react'

const ScaleSettings = ({selectedObject, updateObject}) => {
     // Xử lý Scale
    const handleScaleChange = (increment) => {
        const currentScaleX = selectedObject.scaleX || 1;
        const currentScaleY = selectedObject.scaleY || 1;
        const newScaleX = Math.max(0.1, Math.min(currentScaleX + increment, 5)); // Giới hạn tối đa 5
        const newScaleY = Math.max(0.1, Math.min(currentScaleY + increment, 5)); // Giới hạn tối đa 5
        updateObject({ scaleX: newScaleX, scaleY: newScaleY });
    };
    return (
          <div >
            <label className="block mb-1">Scale</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleScaleChange(-0.1)}
                className="p-1 text-2xl px-3.5 border rounded hover:bg-gray-100"
                title="Zoom Out"
              >
                -
              </button>
              <button
                onClick={() => handleScaleChange(0.1)}
                className="p-1 text-2xl px-3 border rounded hover:bg-gray-100"
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>
  )
}

export default ScaleSettings