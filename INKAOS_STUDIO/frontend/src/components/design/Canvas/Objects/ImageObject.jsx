import React, { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";

const ImageObject = ({
  obj,
  onSelect,
  onUpdate,
  isSelected,
  onDelete,
 
}) => {
  const imageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && isSelected && transformerRef.current) {
      const imageNode = imageRef.current;
      const imageRect = imageNode.getClientRect();
      const padding = 10;
      const paddedWidth = imageRect.width + padding * 2;
      const paddedHeight = imageRect.height + padding * 2;

      transformerRef.current.nodes([imageNode]);
      transformerRef.current.setSize({ width: paddedWidth, height: paddedHeight });
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, obj.scaleX, obj.scaleY]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && e.key === "Delete" && onDelete) {
        onDelete(obj.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, obj.id, onDelete]);

  const handleDragEnd = (e) => {
    const node = e.target;
    const x = node.x() || 0;
    const y = node.y() || 0;
    if (x !== (obj.x || 0) || y !== (obj.y || 0)) {
      onUpdate(obj.id, { x, y });
    }
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const x = node.x() || 0;
    const y = node.y() || 0;
    onUpdate(obj.id, {
      x,
      y,
      rotation: node.rotation() || 0,
      scaleX: node.scaleX() || 1,
      scaleY: node.scaleY() || 1,
    });
  };

  // Đảm bảo các giá trị không phải NaN hoặc undefined
  const safeX = obj.x || 0;
  const safeY = obj.y || 0;
  const safeScaleX = obj.scaleX || 1;
  const safeScaleY = obj.scaleY || 1;
  const safeRotation = obj.rotation || 0;
  const safeWidth = obj.width || 100;
  const safeHeight = obj.height || 100;

  return (
    <>
      <Image
        ref={imageRef}
        image={obj.image}
        x={safeX}
        y={safeY}
        scaleX={safeScaleX * (obj.flipX ? -1 : 1)}
        scaleY={safeScaleY * (obj.flipY ? -1 : 1)}
        offsetX={safeWidth / 2} // Đặt điểm neo ở trung tâm theo trục X
        offsetY={safeHeight / 2} // Đặt điểm neo ở trung tâm theo trục Y
        width={safeWidth}
        height={safeHeight}
        rotation={safeRotation}
        draggable={obj.draggable}
        onClick={() => onSelect(obj.id)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onTransform={(e) => {
          const node = e.target;
          const currentScaleX = node.scaleX() || 1;
          const currentScaleY = node.scaleY() || 1;
          node.scaleX(Math.max(0.1, Math.min(currentScaleX, 5)));
          node.scaleY(Math.max(0.1, Math.min(currentScaleY, 5)));
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          anchorSize={5}
          anchorStroke="skyblue"
          anchorStrokeWidth={1.5}
          enabledAnchors={[
            "middle-left",
            "middle-right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              newBox.width < 20 ||
              newBox.height < 20 ||
              newBox.width > 500 ||
              newBox.height > 500
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default React.memo(ImageObject);