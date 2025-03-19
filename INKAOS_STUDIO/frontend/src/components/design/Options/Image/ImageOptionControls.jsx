import React from 'react'
import LayerControls from "../General/LayerControls";
import AspectRatioSettings from './AspectRatioSettings';
import ScaleSettings from './ScaleSettings';
import RotateSettings from './RotateSettings';
import FlipSettings from './FlipSettings';
const ImageOptions = ({ selectedObject, updateObject, bringToFront, sendToBack }) => {
  if (!selectedObject || selectedObject.type !== 'image') return null;

  return (
    <div className="p-4 flex flex-col gap-3">
      <LayerControls bringToFront={bringToFront} sendToBack={sendToBack} />

      
      <AspectRatioSettings selectedObject={selectedObject} updateObject={updateObject}/>

      <ScaleSettings  selectedObject={selectedObject} updateObject={updateObject}/>

      <RotateSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <FlipSettings selectedObject={selectedObject} updateObject={updateObject}/>
     
    
    </div>
  );
};

export default ImageOptions;