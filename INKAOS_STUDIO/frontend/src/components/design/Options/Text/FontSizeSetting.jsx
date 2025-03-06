import React from 'react'

const FontSizeSetting = ({ selectedObject, updateObject }) => {
    
    const effectiveFontSize = Math.round(selectedObject.fontSize * (selectedObject.scaleX || 1));
    return (
    <div>
        <label htmlFor="">Co chu</label>
        <input 
            type="number"
            value={effectiveFontSize}
            onChange={(e) => {
            const newSize = parseInt(e.target.value);
            updateObject({
                fontSize: newSize,
                scaleX: 1,
                scaleY: 1,
            });
            }}
            min="10"
            max="100"
            className="w-full p-2 border rounded"
        />
    </div>
  )
}

export default FontSizeSetting