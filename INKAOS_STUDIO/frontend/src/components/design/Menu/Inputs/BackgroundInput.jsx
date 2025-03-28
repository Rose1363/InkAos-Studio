import React from 'react';

const BackgroundInput = ({handleBackgroundChange} ) => {
  
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      <button className="border h-16 p-2" onClick={()=>handleBackgroundChange('tshirt')}>
        áo thun
      </button>
      <button className="border h-16 p-2" onClick={()=>handleBackgroundChange('hoodie')}>
        áo hoodie
      </button>
      <button className="border h-16 p-2" onClick={()=>handleBackgroundChange('tanktop')}>
        áo trẻ em
      </button>
    </div>
  );
};

export default BackgroundInput;