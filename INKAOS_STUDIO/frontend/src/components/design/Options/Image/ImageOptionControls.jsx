import React from 'react'
import LayerControls from "../General/LayerControls";
import AspectRatioSettings from './AspectRatioSettings';
import ScaleSettings from './ScaleSettings';
import RotateSettings from './RotateSettings';
import FlipSettings from './FlipSettings';
const ImageOptions = ({ selectedObject, updateObject,objects, setObjects, selectedId}) => {
  if (!selectedObject || selectedObject.type !== 'image') return null;

  return (
    <div className="p-3 flex flex-col gap-3">
      <LayerControls objects={objects} setObjects={setObjects} selectedId={selectedId} />
      
      <AspectRatioSettings selectedObject={selectedObject} updateObject={updateObject}/>

      <ScaleSettings  selectedObject={selectedObject} updateObject={updateObject}/>

      <RotateSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <FlipSettings selectedObject={selectedObject} updateObject={updateObject}/>
     
    
    </div>
  );
};

export default ImageOptions;