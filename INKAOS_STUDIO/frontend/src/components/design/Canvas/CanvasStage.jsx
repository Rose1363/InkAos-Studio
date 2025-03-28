// import React, { useRef } from "react";
// import { Stage, Layer, Text } from "react-konva";
// import TextObject from "./Objects/TextObject";
// import ImageObject from "./Objects/ImageObject";
// import tshirtPhoto from "../../../assets/photo.png"; // Import hình nền trực tiếp
// import hoodie from "../../../assets/hoodi.png";
// import tankTop from "../../../assets/tanktop.jpg";
// import bg from '../../../assets/bg-canvas.jpg'
// import ShapeObject from "./Objects/ShapeObject";

// const CanvasStage = ({
//   objects,
//   setSelectedId = () => {},
//   updateObject = () => {},
//   selectedId = null,
//   onDelete = () => {},
//   canvasWidth = 400,
//   canvasHeight = 500,
//   background = "tshirt",
//    // Thêm prop background
// }) => {
//   const stageRef = useRef(null);

//   // Xác định backgroundImage dựa trên background
//   const getBackgroundImage = () => {
//     switch (background) {
//       case "hoodie":
//         return `url(${hoodie})`;
//       case "tanktop":
//         return `url(${tankTop})`;
//       case "tshirt":
//       default:
//         return `url(${tshirtPhoto})`;
//     }
//   };

//   const handleSelect = (id) => {
//     setSelectedId(id);
//   };

//   return (
//     <Stage
//       ref={stageRef}
//       width={canvasWidth}
//       height={canvasHeight}
//       style={{
//         border: "1px dashed gray",
//         backgroundColor: "lightblue",

//         backgroundImage: `url(${bg})`,  // Đặt background image
//         backgroundSize: "cover",             // Đảm bảo ảnh bao phủ toàn bộ
//         backgroundPosition: "center"         // Đặt vị trí background
//       }}
//     >
//    <Layer>
//         {objects.map((obj) => {
//           if (obj.type === "text") {
//             return (
//               <TextObject
//                 key={obj.id}
//                 obj={obj}
//                 onSelect={handleSelect}
//                 onUpdate={updateObject}
//                 isSelected={selectedId === obj.id}
//                 onDelete={onDelete}
//               />
//             );
//           } else if (obj.type === "image") {
//             return (
//               <ImageObject
//                 key={obj.id}
//                 obj={obj}
//                 onSelect={handleSelect}
//                 onUpdate={updateObject}
//                 isSelected={selectedId === obj.id}
//                 onDelete={onDelete}
//               />
//             );
//           } else if (obj.type === "shape") {
//             return (
//               <ShapeObject
//                 key={obj.id}
//                 obj={obj}
//                 onSelect={handleSelect}
//                 onUpdate={updateObject}
//                 isSelected={selectedId === obj.id}
//                 onDelete={onDelete}
//               />
//             );
//           }
//           return null;
//         })}
//       </Layer>
//     </Stage>
//   );
// };

// export default CanvasStage;

import React, { useRef } from "react";
import { Stage, Layer, } from "react-konva";
import TextObject from "./Objects/TextObject";
import ImageObject from "./Objects/ImageObject";
import tshirtPhoto from "../../../assets/photo.png";
import hoodie from "../../../assets/hoodi.png";
import tankTop from "../../../assets/tanktop.jpg";
import ShapeObject from "./Objects/ShapeObject";
import bg from '../../../assets/bg-canvas.jpg'
const CanvasStage = ({
  stageRef,
  objects,
  setSelectedId = () => {},
  updateObject = () => {},
  selectedId = null,
  onDelete = () => {},
  canvasWidth,
  canvasHeight,
  background = "tshirt",
}) => {
  // const stageRef = useRef(null);

  const getBackgroundImage = () => {
    switch (background) {
      case "hoodie":
        return `url(${hoodie})`;
      case "tanktop":
        return `url(${tankTop})`;
      case "tshirt":
      default:
        return `url(${tshirtPhoto})`;
    }
  };

  const handleStageClick = (e) => {
    // Nếu click trực tiếp vào Stage (không phải vào một phần tử con)
    if (e.target === e.target.getStage()) {
      setSelectedId(null); // Bỏ chọn
    }
  };
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <Stage
      ref={stageRef}
      width={400}
      height={400}
      onClick={handleStageClick} // Thêm sự kiện click
      style={{
                border: "1px dashed gray",
                backgroundColor: "lightblue",
        
                backgroundImage: `url(${bg})`,  // Đặt background image
                backgroundSize: "cover",             // Đảm bảo ảnh bao phủ toàn bộ
                backgroundPosition: "center"         // Đặt vị trí background
              }}
    >
      <Layer>
        {objects && objects.length > 0 && // Chỉ render nếu objects tồn tại và không rỗng
          objects.map((obj) => {
            if (obj.type === "text") {
              return (
                <TextObject
                  key={obj.id}
                  obj={obj}
                  onSelect={handleSelect}
                  onUpdate={updateObject}
                  isSelected={selectedId === obj.id}
                  onDelete={onDelete}
                  canvasWidth={400}
                  canvasHeight={400}
                />
              );
            } else if (obj.type === "image") {
              return (
                <ImageObject
                  key={obj.id}
                  obj={obj}
                  onSelect={handleSelect}
                  onUpdate={updateObject}
                  isSelected={selectedId === obj.id}
                  onDelete={onDelete}
                 
                />
              );
            } else if (obj.type === "shape") {
              return (
                <ShapeObject
                  key={obj.id}
                  obj={obj}
                  onSelect={handleSelect}
                  onUpdate={updateObject}
                  isSelected={selectedId === obj.id}
                  onDelete={onDelete}
                />
              );
            }
            return null;
          })}
      </Layer>
    </Stage>
  );
};

export default CanvasStage;