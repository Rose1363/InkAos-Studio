// src/components/TShirtDesign/Options/ColorSettings.jsx
import React from 'react';

const ColorSettings = ({ selectedObject, updateObject }) => {
  return (
    <div className="mb-2">
      <label className="block mb-1">Mau chu</label>
      <input
        type="color"
        value={selectedObject.fill}
        onChange={(e) => updateObject({ fill: e.target.value })}
        className="w-full h-10"
      />
    </div>
  );
};

export default ColorSettings;