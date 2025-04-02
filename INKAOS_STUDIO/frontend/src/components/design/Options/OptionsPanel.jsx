import React from "react";
import TextOptions from "./Text/TextOptionControls";
import ImageOptions from "./Image/ImageOptionControls";
import Devider from "../../UI/Devider"
import ShapeOptionControls from "./Shape/ShapeOptionControls";
const OptionsPanel = ({
  selectedObject,
  updateObject,
  objects, setObjects, selectedId
}) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền lên window
  };
  return (
    <div 
    onClick={handleClick}
    className="w-30">
      <h3>Tuy chon</h3>
      <Devider/>
      {selectedObject.type === "text" && 
      <TextOptions
        selectedObject={selectedObject}
        updateObject={updateObject} 
        objects={objects}
          setObjects={setObjects}
          selectedId={selectedId}/>}
      {selectedObject.type === "image" && 
      <ImageOptions 
      selectedObject={selectedObject}
      updateObject={updateObject} 
      objects={objects}
      setObjects={setObjects}
      selectedId={selectedId}
      />}
      {
        selectedObject.type === "shape" &&
        <ShapeOptionControls selectedObject={selectedObject}
      updateObject={updateObject} 
      objects={objects}
          setObjects={setObjects}
          selectedId={selectedId} />
      }
    </div>
  );
};

export default OptionsPanel;
