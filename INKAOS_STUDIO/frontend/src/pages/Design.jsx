import React, { useState } from "react";
import DesignMenu from "../components/design/Menu/DesignMenu";
import TextInput from "../components/design/Menu/Inputs/DesignTextInput";
import ImageInput from "../components/design/Menu/Inputs/ImageUploadInput";
import TypeShirtInput from "../components/design/Menu/Inputs/ShirtTypeInput";
import CanvasContainer from "../components/design/Canvas/CanvasContainer";
import OptionsPanel from "../components/design/Options/OptionsPanel";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const Design = () => {
  const [activePanel, setActivePanel] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [typeShirt, setTypeShirt] = useState("tshirt");

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const deleteObject = (id) => {
    setObjects(objects.filter((obj) => obj.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateObject = (id, updates) => {
    setObjects(objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)));
  };

  const addText = (text) => {
    const newText = {
      id: `text-${Date.now()}`,
      type: "text",
      text,
      x: 100,
      y: 100,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000000",
      align: "left",
      fontStyle: "",
      textDecoration: "",
      draggable: true,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    setObjects([...objects, newText]);
    setSelectedId(newText.id);
  };

  const handleImageUpload = (e, preloadedImage = null) => {
    if (preloadedImage) {
      setObjects((prevObjects) => [...prevObjects, preloadedImage]);
      setSelectedId(preloadedImage.id);
    } else {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
            const newImage = {
              id: `image-${Date.now()}`,
              type: "image",
              image: img,
              x: 100,
              y: 100,
              scaleX: 0.5,
              scaleY: 0.5,
              draggable: true,
            };
            setObjects([...objects, newImage]);
            setSelectedId(newImage.id);
          };
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const bringToFront = () => {
    if (selectedId) {
      const selectedIndex = objects.findIndex((obj) => obj.id === selectedId);
      if (selectedIndex !== -1 && selectedIndex < objects.length - 1) {
        const newObjects = [...objects];
        const [selected] = newObjects.splice(selectedIndex, 1);
        newObjects.push(selected);
        setObjects(newObjects);
      }
    }
  };

  const sendToBack = () => {
    if (selectedId) {
      const selectedIndex = objects.findIndex((obj) => obj.id === selectedId);
      if (selectedIndex !== -1 && selectedIndex > 0) {
        const newObjects = [...objects];
        const [selected] = newObjects.splice(selectedIndex, 1);
        newObjects.unshift(selected);
        setObjects(newObjects);
      }
    }
  };

  const handleTypeShirtChange = (type) => {
    setTypeShirt(type);
  };

  const saveDesign = async () => {
    try {
      const textObjects = objects.filter((obj) => obj.type === "text");
      const textDesignIds = [];

      if (textObjects.length === 0) {
        toast.info("Không có văn bản nào để lưu!");
        return;
      }

      for (const textObj of textObjects) {
        const textDesignData = {
          width_text: textObj.width || 200,
          height_text: textObj.height || 50,
          position_x_text: textObj.x,
          position_y_text: textObj.y,
          color_text: textObj.fill,
          size_text: textObj.fontSize,
          text: textObj.text,
          fontFamily: textObj.fontFamily,
          align: textObj.align,
          fontStyle: textObj.fontStyle,
          textDecoration: textObj.textDecoration,
          rotation: textObj.rotation,
          scaleX: textObj.scaleX,
          scaleY: textObj.scaleY,
        };

        const response = await Axios({
          ...SummaryApi.addText,
          data: textDesignData,
        });

        const savedTextDesign = response.data;
        if (!savedTextDesign.success) {
          throw new Error(savedTextDesign.message || "Failed to save TextDesign");
        }
        textDesignIds.push(savedTextDesign.data._id);
      }

      toast.success("Thiết kế đã được lưu thành công!");

      return textDesignIds;
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-700">
      <DesignMenu togglePanel={togglePanel} />
      {activePanel && (
        <div className="bg-slate-50 w-80">
          {activePanel === "text" && <TextInput addText={addText} />}
          {activePanel === "upload" && <ImageInput handleImageUpload={handleImageUpload} />}
          {activePanel === "typeshirt" && <TypeShirtInput handleTypeShirtChange={handleTypeShirtChange} />}
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          <button
            onClick={saveDesign}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu Thiết Kế
          </button>
        </div>
        <CanvasContainer
          objects={objects}
          setSelectedId={setSelectedId}
          updateObject={updateObject}
          activePanel={activePanel}
          selectedId={selectedId}
          onDelete={deleteObject}
          typeShirt={typeShirt}
        />
      </div>
      {activePanel && (
        <div className="w-45 bg-gray-50 p-4">
          <OptionsPanel
            selectedObject={objects.find((obj) => obj.id === selectedId) || {}}
            updateObject={(updates) => updateObject(selectedId, updates)}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
          />
        </div>
      )}
    </div>
  );
};

export default Design;