import React from 'react';

const FontSettings = ({ selectedObject, updateObject }) => {

  return (
    <div className="mb-2">
      <label htmlFor="" className="block mb-1">Font</label>
      <select 
        value={selectedObject.fontFamily}
        onChange={(e) => updateObject({ fontFamily: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Courier">Courier</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Garamond">Garamond</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Impact">Impact</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Lucida Sans">Lucida Sans</option>
        <option value="Palatino">Palatino</option>
        <option value="Futura">Futura</option>
      </select>
    </div>
  );
};

export default FontSettings;
