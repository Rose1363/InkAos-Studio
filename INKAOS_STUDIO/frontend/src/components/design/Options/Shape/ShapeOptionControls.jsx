import React from "react";
import LayerControls from "../General/LayerControls";
import FillColorSetting from "./FillColorSetting";
import BorderColorSetting from "./BorderColorSetting";
import BorderWidthSetting from "./BorderWidthSetting";

const ShapeOptionControls = ({ selectedObject, updateObject, objects, setObjects, selectedId}) => {
  return (
    <div className="p-3 flex flex-col gap-3">
<LayerControls objects={objects} setObjects={setObjects} selectedId={selectedId} />
      <FillColorSetting selectedObject={selectedObject} updateObject={updateObject}/>
      <BorderColorSetting selectedObject={selectedObject} updateObject={updateObject}/>
      <BorderWidthSetting selectedObject={selectedObject} updateObject={updateObject}/>

    </div>
  );
};

export default ShapeOptionControls;
