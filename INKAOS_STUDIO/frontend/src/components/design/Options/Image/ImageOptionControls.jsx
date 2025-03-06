import React from 'react'
import LayerControls from "../General/LayerControls";
import { IoExpand, IoContract } from "react-icons/io5";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
const ImageOptions = ({ selectedObject, updateObject, bringToFront, sendToBack }) => {
  if (!selectedObject || selectedObject.type !== 'image') return null;

  // Xử lý Fill/Fit (Aspect Ratio)
  const handleAspectRatio = (mode) => {
    if (mode === 'fill') {
      updateObject({ scaleX: 1, scaleY: 1 }); // Reset scale để lấp đầy
    } else if (mode === 'fit') {
      updateObject({ scaleX: 0.5, scaleY: 0.5 }); // Giảm scale để vừa vùng
    }
  };

  // Xử lý Scale
  const handleScaleChange = (increment) => {
    const currentScaleX = selectedObject.scaleX || 1;
    const currentScaleY = selectedObject.scaleY || 1;
    const newScaleX = Math.max(0.1, Math.min(currentScaleX + increment, 5)); // Giới hạn tối đa 5
    const newScaleY = Math.max(0.1, Math.min(currentScaleY + increment, 5)); // Giới hạn tối đa 5
    updateObject({ scaleX: newScaleX, scaleY: newScaleY });
  };

  // Xử lý Rotate
  const handleRotateChange = (rotation) => {
    let normalizedRotation = ((rotation % 360) + 360) % 360;
    if (normalizedRotation > 360) normalizedRotation -= 360;
    if (normalizedRotation < -360) normalizedRotation += 360;
    console.log('New rotation:', normalizedRotation);
    updateObject({ rotation: normalizedRotation });
  };

  // Xử lý Flip
  const handleFlip = (direction) => {
    if (direction === 'horizontal') {
      updateObject({ flipX: !selectedObject.flipX });
    } else if (direction === 'vertical') {
      updateObject({ flipY: !selectedObject.flipY });
    }
  };

  return (
    <div className="p-4">
      <LayerControls bringToFront={bringToFront} sendToBack={sendToBack} />

      {/* Aspect Ratio (Fill/Fit) */}
      <div className="mb-4">
        <label className="block mb-1">Aspect Ratio</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleAspectRatio('fill')}
            className={`p-2 border rounded ${selectedObject.scaleX === 1 && selectedObject.scaleY === 1 ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
            title="Fill"
          >
           <IoExpand size={20}/>
          </button>
          <button
            onClick={() => handleAspectRatio('fit')}
            className={`p-2 border rounded ${selectedObject.scaleX === 0.5 && selectedObject.scaleY === 0.5 ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
            title="Fit"
          >
            <IoContract size={20} />
          </button>
        </div>
      </div>

      {/* Scale */}
      <div className="mb-4">
        <label className="block mb-1">Scale</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleScaleChange(-0.1)}
            className="p-2 border rounded hover:bg-gray-100"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => handleScaleChange(0.1)}
            className="p-2 border rounded hover:bg-gray-100"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>

      {/* Rotate */}
      <div className="mb-4">
        <label className="block mb-1">Rotate</label>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleRotateChange((selectedObject.rotation || 0) - 90)}
            className="p-2 border rounded hover:bg-gray-100"
            title="Rotate Left"
          >
            <FaArrowRotateLeft />
          </button>
          <button
            onClick={() => handleRotateChange((selectedObject.rotation || 0) + 90)}
            className="p-2 border rounded hover:bg-gray-100"
            title="Rotate Right"
          >
            
            <FaArrowRotateRight />
          </button>
          <input
            type="number"
            value={selectedObject.rotation || 0}
            onChange={(e) => handleRotateChange(parseInt(e.target.value) || 0)}
            className="w-16 p-2 border rounded"
            min="-360"
            max="360"
          />
        </div>
      </div>

      {/* Flip */}
      <div className="mb-4">
        <label className="block mb-1">Flip</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleFlip('horizontal')}
            className={`p-2 border rounded ${selectedObject.flipX ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
            title="Flip Horizontal"
          >
            <LuFlipHorizontal2 />
          </button>
          <button
            onClick={() => handleFlip('vertical')}
            className={`p-2 border rounded ${selectedObject.flipY ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
            title="Flip Vertical"
          >
            <LuFlipVertical2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageOptions;