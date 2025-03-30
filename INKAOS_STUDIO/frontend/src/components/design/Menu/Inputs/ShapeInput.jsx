import React from "react";
import { PiCircleFill, PiRectangleFill } from "react-icons/pi";
import {
  MdRectangle,
  MdPentagon,
  MdHexagon,
  MdOutlineStar,
} from "react-icons/md";
import { GiHearts } from "react-icons/gi";
import { IoTriangleSharp } from "react-icons/io5";
const ShapeInput = ({ addShape, selectedColor }) => {
  const shapes = [
    {
      type: "rectangle",
      label: "Hình chữ nhật",
      icon: <MdRectangle size={40} />,
      color: "text-blue-600",
      fillColor: "#3B82F6",
    },
    {
      type: "cornerRectangle",
      label: "Chữ nhật bo góc",
      icon: <PiRectangleFill size={40} />,
      color: "text-purple-600",
      fillColor: "#8B5CF6",
    },
    {
      type: "circle",
      label: "Hình tròn",
      icon: <PiCircleFill size={40} />,
      color: "text-red-600",
      fillColor: "#EF4444",
    },
    {
      type: "triangle",
      label: "Hình tam giác",
      icon: <IoTriangleSharp size={40} />,
      color: "text-green-600",
      fillColor: "#10B981",
    },
    {
      type: "heart",
      label: "Hình trái tim",
      icon: <GiHearts size={40} />,
      color: "text-pink-600",
      fillColor: "#EC4899",
    },
    {
      type: "star",
      label: "Hình ngôi sao",
      icon: <MdOutlineStar size={40} />,
      color: "text-yellow-500",
      fillColor: "#F59E0B",
    },
    {
      type: "hexagon",
      label: "Hình lục giác",
      icon: <MdHexagon size={40} />,
      color: "text-indigo-600",
      fillColor: "#4F46E5",
    },
    {
      type: "pentagon",
      label: "Hình ngũ giác",
      icon: <MdPentagon size={40} />,
      color: "text-teal-600",
      fillColor: "#14B8A6",
    },
  ];

  const handleAddShape = (shapeType) => {
    const shapeConfig = shapes.find((shape) => shape.type === shapeType);

    const baseProps = {
      id: `shape-${Date.now()}`,
      type: "shape",
      shapeType: shapeType,
      x: 100,
      y: 100,
      fill: selectedColor || shapeConfig.fillColor,
      stroke: "#000000",
      strokeWidth: 2,
      draggable: true,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
    };

    let shapeSpecificProps = {};
    switch (shapeType) {
      case "rectangle":
        shapeSpecificProps = { width: 100, height: 75, cornerRadius: 0 };
        break;
      case "cornerRectangle":
        shapeSpecificProps = { width: 100, height: 75, cornerRadius: 15 };
        break;
      case "circle":
        shapeSpecificProps = { radius: 50 };
        break;
      case "triangle":
        shapeSpecificProps = { sides: 3, radius: 50 };
        break;
      case "heart":
        shapeSpecificProps = { width: 100, height: 100 };
        break;
      case "star":
        shapeSpecificProps = { innerRadius: 25, outerRadius: 50, numPoints: 5 };
        break;
      case "hexagon":
        shapeSpecificProps = { sides: 6, radius: 50 };
        break;
      case "pentagon":
        shapeSpecificProps = { sides: 5, radius: 50 };
        break;

      default:
        break;
    }

    const newShape = { ...baseProps, ...shapeSpecificProps };
    addShape(newShape);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            onClick={() => handleAddShape(shape.type)}
            className={`
              flex flex-col items-center justify-center p-3 
              bg-white rounded-lg border border-gray-200
              hover:shadow-md hover:border-gray-300
              transform transition-all duration-200
              hover:scale-105 active:scale-95
              group
            `}
            title={shape.label}
          >
            <div className={`${shape.color} transition-colors duration-200`}>
              {shape.icon}
            </div>
            <span className="text-xs mt-2 text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
              {shape.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapeInput;
