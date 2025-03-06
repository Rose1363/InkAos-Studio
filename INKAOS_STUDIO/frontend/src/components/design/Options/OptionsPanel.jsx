import React from "react";
import TextOptions from "./Text/TextOptionControls";
import ImageOptions from "./Image/ImageOptionControls";
import Devider from "../../UI/Devider"
const OptionsPanel = ({
  selectedObject,
  updateObject,
  bringToFront,
  sendToBack,
}) => {
  
  return (
    <div>
      <h3>Tuy chon</h3>
      <Devider/>
      {selectedObject.type === "text" && 
      <TextOptions
        selectedObject={selectedObject}
        updateObject={updateObject} 
        bringToFront={bringToFront}
        sendToBack={sendToBack}/>}
      {selectedObject.type === "image" && 
      <ImageOptions 
      selectedObject={selectedObject}
      updateObject={updateObject} 
      bringToFront={bringToFront}
      sendToBack={sendToBack}
      />}
    </div>
  );
};

export default OptionsPanel;
