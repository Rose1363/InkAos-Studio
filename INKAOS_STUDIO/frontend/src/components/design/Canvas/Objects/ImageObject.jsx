// src/components/TShirtDesign/Objects/ImageObject.jsx
import React, { useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';

const ImageObject = ({ obj, onSelect, onUpdate, isSelected, onDelete, canvasWidth, canvasHeight }) => {
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
  }, [isSelected, obj.scaleX, obj.scaleY, transformerRef]);

  // Điều chỉnh vị trí nếu hình ảnh vượt ra ngoài giới hạn canvas
  const handleBoundaries = (node) => {
    const padding = 10;
    const imageRect = node.getClientRect();
    const imageWidth = imageRect.width + padding * 2;
    const imageHeight = imageRect.height + padding * 2;

    let newX = node.x();
    let newY = node.y();

    if (newX < -padding) newX = -padding;
    if (newX + imageWidth > canvasWidth + padding) newX = canvasWidth - imageWidth + padding;
    if (newY < -padding) newY = -padding;
    if (newY + imageHeight > canvasHeight + padding) newY = canvasHeight - imageHeight + padding;

    return { x: newX, y: newY };
  };

   // Xử lý phím Delete để xóa ảnh
   useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && e.key === 'Delete' && onDelete) {
        onDelete(obj.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, obj.id, onDelete]);

  // Xử lý kéo hình ảnh
  const handleDragEnd = (e) => {
    const node = e.target;
    const { x, y } = handleBoundaries(node);
    if (x !== obj.x || y !== obj.y) {
      onUpdate(obj.id, { x, y });
    }
  };

  // Xử lý thay đổi kích thước hoặc xoay
  const handleTransformEnd = (e) => {
    const node = e.target;
    const { x, y } = handleBoundaries(node);
    onUpdate(obj.id, {
      x,
      y,
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  };

  return (
    <>
      <Image
        ref={imageRef}
        key={obj.id}
        image={obj.image}
        x={obj.x}
        y={obj.y}
        scaleX={(obj.scaleX || 1) * (obj.flipX ? -1 : 1)} // Lật ngang
        scaleY={(obj.scaleY || 1) * (obj.flipY ? -1 : 1)} // Lật dọc
        rotation={obj.rotation || 0}
        draggable={obj.draggable}
        onClick={() => onSelect(obj.id)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onTransform={(e) => {
          const node = e.target;
          node.scaleX(Math.max(0.1, Math.min(node.scaleX(), 5)));
          node.scaleY(Math.max(0.1, Math.min(node.scaleY(), 5)));
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          anchorSize={5}
          anchorStroke="skyblue"
          anchorStrokeWidth={1.5}
          enabledAnchors={['middle-left', 'middle-right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20 || newBox.width > 500 || newBox.height > 500) {
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