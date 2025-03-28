import React from 'react'

const FillColorSetting = ({selectedObject, updateObject}) => {
  return (
    <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {/* Fill Color */}
          <div className="flex-1">
            <label className="block ">Fill Color</label>
            <input
              type="color"
              name="fill"
              value={selectedObject.fill}
            onChange={(e) => updateObject({ fill: e.target.value })}
             className="w-full h-10"
            />
          </div>
          {/* Border Color (stroke) */}
         

         
        </div>

      
      </div>
  )
}

export default FillColorSetting