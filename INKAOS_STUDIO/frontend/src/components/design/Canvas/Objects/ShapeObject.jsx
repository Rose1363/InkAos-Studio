import React, { useEffect, useRef } from "react";
import {
  Rect,
  Circle,
  RegularPolygon,
  Star,
  Line,
  Transformer,
  Path,
} from "react-konva";

const ShapeObject = ({ obj, onSelect, onUpdate, isSelected, onDelete }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && e.key === "Delete" && onDelete) {
        onDelete(obj.id);
      }
      // Thêm phím tắt để thay đổi thuộc tính
      if (isSelected && e.key === "ArrowUp" && e.shiftKey) {
        onUpdate(obj.id, {
          strokeWidth: Math.min((obj.strokeWidth || 2) + 1, 10),
        });
      }
      if (isSelected && e.key === "ArrowDown" && e.shiftKey) {
        onUpdate(obj.id, {
          strokeWidth: Math.max((obj.strokeWidth || 2) - 1, 1),
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, obj.id, onDelete, obj.strokeWidth, onUpdate]);

  const handleDragEnd = (e) => {
    onUpdate(obj.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e) => {
    const node = shapeRef.current;
    const updates = {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    };

    // // Cập nhật kích thước cho các hình đặc biệt
    // if (obj.shapeType === "rectangle") {
    //   updates.width = node.width() * node.scaleX();
    //   updates.height = node.height() * node.scaleY();
    //   updates.scaleX = 1;
    //   updates.scaleY = 1;
    // }

    onUpdate(obj.id, updates);
  };

  const commonProps = {
    ref: shapeRef,
    x: obj.x || 0,
    y: obj.y || 0,
    scaleX: obj.scaleX || 1,
    scaleY: obj.scaleY || 1,
    rotation: obj.rotation || 0,
    draggable: obj.draggable !== false,
    onClick: () => onSelect(obj.id),
    onTap: () => onSelect(obj.id),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    fill: obj.fill || "#000000",
    stroke: obj.stroke || "#000000",
    strokeWidth: Number(obj.strokeWidth) || 2,
    opacity: obj.opacity || 1,
    shadowColor: obj.shadowColor,
    shadowBlur: obj.shadowBlur,
    shadowOpacity: obj.shadowOpacity,
    shadowOffsetX: obj.shadowOffsetX,
    shadowOffsetY: obj.shadowOffsetY,
  };

  const renderShape = () => {
    switch (obj.shapeType) {
      case "rectangle":
        return (
          <Rect
            {...commonProps}
            width={obj.width || 100}
            height={obj.height || 50}
            cornerRadius={obj.cornerRadius || 0}
          />
        );
      case "cornerRectangle":
        return (
          <Rect
            {...commonProps}
            width={obj.width || 100}
            height={obj.height || 50}
            cornerRadius={obj.cornerRadius || 0}
          />
        );
      case "circle":
        return <Circle {...commonProps} radius={obj.radius || 50} />;
      case "triangle":
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={obj.radius || 50}
          />
        );
      case "star":
        return (
          <Star
            {...commonProps}
            innerRadius={obj.innerRadius || 25}
            outerRadius={obj.radius || 50}
            numPoints={obj.points || 5}
          />
        );

      case "hexagon":
        return (
          <RegularPolygon
            {...commonProps}
            sides={6}
            radius={obj.radius || 50}
          />
        );
      case "pentagon":
        return (
          <RegularPolygon
            {...commonProps}
            sides={5}
            radius={obj.radius || 50}
          />
        );

      case "heart":
        return (
          <Path
            {...commonProps}
            data="M50 40 C20 0 0 50 20 75 C40 100 50 120 50 120 C50 120 60 100 80 75 C100 50 80 0 50 40 Z"
            width={obj.width || 100}
            height={obj.height || 100}
          />
        );

      default:
        return (
          <Rect
            {...commonProps}
            width={obj.width || 100}
            height={obj.height || 50}
          />
        );
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={
            obj.shapeType === "line" || obj.shapeType === "arrow"
              ? []
              : undefined
          }
        />
      )}
    </>
  );
};

export default ShapeObject;
