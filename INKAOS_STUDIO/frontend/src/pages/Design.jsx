import React, { useEffect, useRef, useState } from "react";
import DesignMenu from "../components/design/Menu/DesignMenu";
import TextInput from "../components/design/Menu/Inputs/DesignTextInput";
import ImageInput from "../components/design/Menu/Inputs/ImageUploadInput";
import BackgroundInput from "../components/design/Menu/Inputs/BackgroundInput";
import CanvasStage from "../components/design/Canvas/CanvasStage";
import OptionsPanel from "../components/design/Options/OptionsPanel";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import uploadImage from "../utils/uploadImage";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import IsAdmin from "../utils/IsAdmin";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/UI/Loading";
import ShapeInput from "../components/design/Menu/Inputs/ShapeInput";
import { Stage } from "react-konva"; // Thêm Stage để ref
const Design = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [activePanel, setActivePanel] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [background, setBackground] = useState("tshirt");
  const [designName, setDesignName] = useState("Thiết kế mới");
  const [isUploading, setIsUploading] = useState(false);
  const stageRef = useRef(null);
  const canvasContainerRef = useRef(null);
  // Load dữ liệu từ state khi chỉnh sửa
  // Trong useEffect load design để chỉnh sửa
  useEffect(() => {
    const designToEdit = location.state?.designToEdit;
    if (designToEdit) {
      setDesignName(designToEdit.name);
      setBackground(designToEdit.background || "tshirt");
      setObjects(
        designToEdit.elements.map((el) => {
          if (el.type === "image") {
            const img = new window.Image();
            img.crossOrigin = "Anonymous"; // Thêm dòng này
            img.src = el.imageUrl;
            return {
              ...el,
              id: `image-${Date.now()}-${Math.random()}`,
              image: img,
            };
          }
          return { ...el, id: `text-${Date.now()}-${Math.random()}` };
        })
      );
    }
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        canvasContainerRef.current &&
        !canvasContainerRef.current.contains(e.target)
      ) {
        setSelectedId(null); // Bỏ chọn khi click ra ngoài canvas
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
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
    setObjects(
      objects.map((obj) => {
        return obj.id === id ? { ...obj, ...updates } : obj;
      })
    );
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
      fontStyle: "normal",
      textDecoration: "none",
      draggable: true,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    setObjects([...objects, newText]);
    setSelectedId(newText.id);
  };

  const handleImageUpload = async (e, preloadedImage = null) => {
    if (preloadedImage) {
      setObjects((prevObjects) => [...prevObjects, preloadedImage]);
      setSelectedId(preloadedImage.id);
    } else {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        try {
          const response = await uploadImage(file);
          if (response.data && response.data.success) {
            const imageUrl = response.data.data.url;
            const img = new window.Image();
            img.crossOrigin = "anonymous"; // Thêm dòng này
            img.src = imageUrl;
            img.onload = () => {
              const newImage = {
                id: `image-${Date.now()}`,
                type: "image",
                image: img,
                imageUrl: imageUrl,
                x: 100,
                y: 100,
                scaleX: 0.5,
                scaleY: 0.5,
                draggable: true,
                width: img.width,
                rotation: 0,
                flipX: false, // Khởi tạo flipX
                flipY: false, // Khởi tạo flipY
                height: img.height,
              };
              setObjects((prevObjects) => [...prevObjects, newImage]);
              setSelectedId(newImage.id);
            };
          } else {
            throw new Error(response.message || "Failed to upload image");
          }
        } catch (error) {
          console.error("Lỗi khi upload hình ảnh:", error);
          toast.error("Không thể upload hình ảnh");
        } finally {
          setIsUploading(false);
        }
      }
    }
  };
  const addShape = (shape) => {
    setObjects([...objects, shape]);
    setSelectedId(shape.id);
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

  const handleBackgroundChange = (bg) => {
    setBackground(bg);
  };

  const generateThumbnail = () => {
    if (stageRef.current) {
      try {
        return stageRef.current.toDataURL({
          mimeType: "image/png",
          quality: 1,
          pixelRatio: 1,
        });
      } catch (error) {
        console.error("Lỗi khi tạo thumbnail:", error);
        toast.error("Không thể tạo thumbnail do lỗi CORS!");
        return null;
      }
    }
    return null;
  };
  const saveDesign = () => {
    const thumbnail = generateThumbnail(); // Tạo thumbnail
    const designData = {
      name: designName || "Thiết kế không tên",
      userId: user?._id,
      style: "casual",
      elements: objects.map((obj) => {
        const ensureNumber = (value, defaultValue = 0) =>
          isNaN(value) || value === undefined ? defaultValue : Number(value);

        if (obj.type === "text") {
          return {
            type: "text",
            text: obj.text || "",
            x: ensureNumber(obj.x, 0),
            y: ensureNumber(obj.y, 0),
            fontSize: ensureNumber(obj.fontSize, 20),
            fontFamily: obj.fontFamily || "Arial",
            fill: obj.fill || "#000000",
            align: obj.align || "center",
            fontStyle: obj.fontStyle || "normal",
            textDecoration: obj.textDecoration || "none",
            rotation: ensureNumber(obj.rotation, 0),
            scaleX: ensureNumber(obj.scaleX, 1),
            scaleY: ensureNumber(obj.scaleY, 1),
            draggable: obj.draggable !== undefined ? obj.draggable : true,
          };
        } else if (obj.type === "image") {
          if (!obj.imageUrl) {
            throw new Error("Image object is missing imageUrl");
          }
          return {
            type: "image",
            imageUrl: obj.imageUrl,
            x: ensureNumber(obj.x, 0),
            y: ensureNumber(obj.y, 0),
            width: ensureNumber(obj.width, 100),
            height: ensureNumber(obj.height, 100),
            scaleX: ensureNumber(obj.scaleX, 1),
            scaleY: ensureNumber(obj.scaleY, 1),
            rotation: ensureNumber(obj.rotation, 0),
            flipX: obj.flipX || false,
            flipY: obj.flipY || false,
            draggable: obj.draggable !== undefined ? obj.draggable : true,
          };
        } else if (obj.type === "shape") {
          const baseShapeProps = {
            type: "shape",
            shapeType: obj.shapeType || "rectangle",
            x: ensureNumber(obj.x, 0),
            y: ensureNumber(obj.y, 0),
            fill: obj.fill || "#000000",
            stroke: obj.stroke || "#000000",
            strokeWidth: ensureNumber(obj.strokeWidth, 2),
            rotation: ensureNumber(obj.rotation, 0),
            scaleX: ensureNumber(obj.scaleX, 1),
            scaleY: ensureNumber(obj.scaleY, 1),
            draggable: obj.draggable !== undefined ? obj.draggable : true,
            opacity: ensureNumber(obj.opacity, 1),
            shadowColor: obj.shadowColor,
            shadowBlur: obj.shadowBlur,
            shadowOpacity: obj.shadowOpacity,
            shadowOffsetX: obj.shadowOffsetX,
            shadowOffsetY: obj.shadowOffsetY,
          };

          switch (obj.shapeType) {
            case "rectangle":
            case "cornerRectangle":
              return {
                ...baseShapeProps,
                width: ensureNumber(obj.width, 100),
                height: ensureNumber(obj.height, 50),
                cornerRadius: ensureNumber(obj.cornerRadius, 0),
              };
            case "circle":
            case "triangle":
            case "hexagon":
            case "pentagon":
              return {
                ...baseShapeProps,
                radius: ensureNumber(obj.radius, 50),
              };
            case "star":
              return {
                ...baseShapeProps,
                innerRadius: ensureNumber(obj.innerRadius, 25),
                outerRadius: ensureNumber(obj.radius, 50),
                numPoints: ensureNumber(obj.points, 5),
              };
            case "heart":
              return {
                ...baseShapeProps,
                width: ensureNumber(obj.width, 100),
                height: ensureNumber(obj.height, 100),
                data: obj.data || "M50 40 C20 0 0 50 20 75 C40 100 50 120 50 120 C50 120 60 100 80 75 C100 50 80 0 50 40 Z",
              };
            default:
              return {
                ...baseShapeProps,
                width: ensureNumber(obj.width, 100),
                height: ensureNumber(obj.height, 50),
              };
          }
        }
        return obj;
      }),
      canvasWidth: 400,
      canvasHeight: 500,
      background: background,
      basePrice: 0,
      isPublic: false,
      tags: [],
      thumbnail,
    };

    if (IsAdmin(user?.role)) {
      navigate("/dashboard/upload-design", {
        state: { tempDesign: designData },
      });
    } else {
      toast.success("Thiết kế đã được lưu tạm thời!");
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <div className="flex">
        <DesignMenu togglePanel={togglePanel} />
        {activePanel && (
          <div className="bg-gray-50 w-80">
            {activePanel === "text" && <TextInput addText={addText} />}
            {activePanel === "upload" && (
              <ImageInput
                handleImageUpload={handleImageUpload}
                isUploading={isUploading}
              />
            )}
            {activePanel === "shape" && <ShapeInput addShape={addShape} />}
            {activePanel === "background" && (
              <BackgroundInput
                handleBackgroundChange={handleBackgroundChange}
              />
            )}
          </div>
        )}
      </div>
      <div className="w-full bg-gray-700 flex flex-col">
        <div className="flex justify-between p-4 items-center bg-gray-800 shadow">
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="p-2 rounded w-64 text-gray-200 focus:outline-none focus:text-white transition-all duration-200"
            placeholder="Tên thiết kế"
          />
          <button
            type="button"
            onClick={saveDesign}
            className={`
              relative
              bg-indigo-600
              text-white
              px-5 py-2.5
              rounded-lg
              font-semibold
              transition-all
              duration-200
              ease-in-out
              hover:bg-indigo-700
              hover:shadow-lg
              hover:scale-105
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${isUploading ? "pl-12" : ""}
            `}
            disabled={objects.length === 0 || isUploading}
          >
            <div className="flex items-center justify-center">
              {isUploading ? (
                <>
                  <span className="absolute left-2">
                    <Loading size="small" />
                  </span>
                  <span className="text-white">Đang xử lý...</span>
                </>
              ) : (
                "Hoàn thành"
              )}
            </div>
          </button>
        </div>
        <div className="flex justify-center mt-30">
          <div
            ref={canvasContainerRef}
          >
            <CanvasStage
              stageRef={stageRef}
              objects={objects}
              setSelectedId={setSelectedId}
              updateObject={updateObject}
              selectedId={selectedId}
              onDelete={deleteObject}
              background={background} 
            />
          </div>
        </div>
      </div>
      <div className="ml-auto">
        {(selectedId || activePanel) && (
          <div className="w-52 h-full bg-gray-50 p-4">
            <OptionsPanel
              selectedObject={
                objects.find((obj) => obj.id === selectedId) || {}
              }
              updateObject={(updates) => updateObject(selectedId, updates)}
              bringToFront={bringToFront}
              sendToBack={sendToBack}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Design;
