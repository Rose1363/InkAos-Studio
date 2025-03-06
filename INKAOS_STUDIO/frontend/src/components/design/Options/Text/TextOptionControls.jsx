import React from "react";
import LayerControls from "../General/LayerControls";
import FontSettings from "./FontSettings";
import ColorSettings from "./ColorSettings";
import AlignmentSettings from "./AlignmentSettings";
import FontSizeSetting from "./FontSizeSetting";
import StyleSettings from "./StyleSettings"
const TextOptions = ({ selectedObject, updateObject, bringToFront, sendToBack }) => {
  return (
    <div>
      <LayerControls bringToFront={bringToFront} sendToBack={sendToBack}/>
      <FontSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <FontSizeSetting selectedObject={selectedObject} updateObject={updateObject} />
      <AlignmentSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <StyleSettings selectedObject={selectedObject} updateObject={updateObject}/>
      <ColorSettings selectedObject={selectedObject} updateObject={updateObject}/>

    </div>
  );
};

export default TextOptions;
