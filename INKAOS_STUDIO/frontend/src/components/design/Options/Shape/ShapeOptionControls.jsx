import React from "react";
import LayerControls from "../General/LayerControls";
import FillColorSetting from "./FillColorSetting";
import BorderColorSetting from "./BorderColorSetting";
import BorderWidthSetting from "./BorderWidthSetting";

const ShapeOptionControls = ({ selectedObject, updateObject, bringToFront, sendToBack }) => {
  return (
    <div className="p-3 flex flex-col gap-3">
      <LayerControls bringToFront={bringToFront} sendToBack={sendToBack}/>
      <FillColorSetting selectedObject={selectedObject} updateObject={updateObject}/>
      <BorderColorSetting selectedObject={selectedObject} updateObject={updateObject}/>
      <BorderWidthSetting selectedObject={selectedObject} updateObject={updateObject}/>

    </div>
  );
};

export default ShapeOptionControls;
