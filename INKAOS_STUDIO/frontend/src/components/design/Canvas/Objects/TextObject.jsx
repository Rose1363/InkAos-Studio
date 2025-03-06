import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';

const TextObject = ({ obj, onSelect, onUpdate, isSelected, canvasWidth, canvasHeight }) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Xử lý sự kiện nhấp đúp để chỉnh sửa văn bản
  const handleDblClick = () => {
    const newText = prompt('Enter new text:', obj.text);
    if (newText !== null && newText !== obj.text) {
      onUpdate(obj.id, { text: newText });
    }
  };

  // Xử lý kéo văn bản
  const handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    if (newX !== obj.x || newY !== obj.y) {
      onUpdate(obj.id, {
        x: newX,
        y: newY,
      });
    }
  };

  // Điều chỉnh vị trí nếu văn bản vượt ra ngoài giới hạn canvas
  const handleBoundaries = (node) => {
    let newX = node.x();
    let newY = node.y();
    const width = node.width() * node.scaleX();
    const height = node.height() * node.scaleY();

    // Điều chỉnh nếu vượt giới hạn trái/phải
    if (newX < 0) newX = 0;
    if (newX + width > canvasWidth) newX = canvasWidth - width;

    // Điều chỉnh nếu vượt giới hạn trên/dưới
    if (newY < 0) newY = 0;
    if (newY + height > canvasHeight) newY = canvasHeight - height;

    return { x: newX, y: newY };
  };

  // Xử lý thay đổi kích thước hoặc xoay
  const handleTransformEnd = (e) => {
    const node = e.target;
    const { x, y } = handleBoundaries(node); // Điều chỉnh vị trí nếu cần
    const newAttrs = {
      x: x,
      y: y,
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    };

    onUpdate(obj.id, newAttrs);
  };

  return (
    <>
      <Text
        ref={textRef}
        key={obj.id}
        text={obj.text}
        x={obj.x}
        y={obj.y}
        fontFamily={obj.fontFamily}
        fontSize={obj.fontSize}
        fill={obj.fill}
        align={obj.align || 'left'}
        fontStyle={obj.fontStyle || ''}
        textDecoration={obj.textDecoration || ''}
        draggable={obj.draggable}
        rotation={obj.rotation || 0}
        scaleX={obj.scaleX || 1}
        scaleY={obj.scaleY || 1}
        width={obj.width || 200}
        wrap="word"
        onClick={() => onSelect(obj.id)}
        onDblClick={handleDblClick} // Nhấp đúp để chỉnh sửa văn bản
        onDragEnd={handleDragEnd} // Kết thúc kéo
        onTransformEnd={handleTransformEnd} // Kết thúc thay đổi kích thước/ xoay
        onTransform={(e) => {
          const node = e.target;
          node.scaleX(Math.max(0.1, node.scaleX()));
          node.scaleY(Math.max(0.1, node.scaleY()));
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          anchorSize={4} // Kích thước điểm điều khiển lớn hơn
          anchorStroke="skyblue" // Màu đường viền của điểm điều khiển là màu đỏ
          anchorStrokeWidth={1.5}
          enabledAnchors={['middle-left', 'middle-right','top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // Giới hạn kích thước tối thiểu và tối đa
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

export default React.memo(TextObject);
