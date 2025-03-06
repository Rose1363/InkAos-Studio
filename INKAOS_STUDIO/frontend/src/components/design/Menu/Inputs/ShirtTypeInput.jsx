import React from 'react';

const TypeShirtInput = ({handleTypeShirtChange} ) => {
  
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      <button className="border h-16 p-2" onClick={()=>handleTypeShirtChange('tshirt')}>
        áo thun
      </button>
      <button className="border h-16 p-2" onClick={()=>handleTypeShirtChange('hoodie')}>
        áo hoodie
      </button>
      <button className="border h-16 p-2" onClick={()=>handleTypeShirtChange('tanktop')}>
        áo trẻ em
      </button>
    </div>
  );
};

export default TypeShirtInput;