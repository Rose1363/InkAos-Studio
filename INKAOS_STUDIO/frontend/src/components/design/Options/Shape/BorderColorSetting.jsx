import React from 'react'

const BorderColorSetting = ({selectedObject, updateObject}) => {
  return (
    <div className="flex-1">
    <label className="block">Border Color</label>
    <input
      type="color"
      name="stroke"
      value={selectedObject.stroke}
    onChange={(e) => updateObject({ stroke: e.target.value })}
      className="w-full h-10"
    />
  </div>
  )
}

export default BorderColorSetting