import React from "react";
import LayerControls from "../General/LayerControls";
import FontSettings from "./FontSettings";
import ColorSettings from "../General/ColorSettings";
import AlignmentSettings from "./AlignmentSettings";
import FontSizeSetting from "./FontSizeSetting";
import StyleSettings from "./StyleSettings"
const TextOptions = ({ selectedObject, updateObject, objects, setObjects, selectedId}) => {
  return (
    <div className="p-3 flex flex-col gap-3">
<LayerControls objects={objects} setObjects={setObjects} selectedId={selectedId} /> 
     <FontSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <FontSizeSetting selectedObject={selectedObject} updateObject={updateObject} />
      <AlignmentSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <StyleSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <ColorSettings selectedObject={selectedObject} updateObject={updateObject}/>

    </div>
  );
};

export default TextOptions;
