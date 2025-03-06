import React, { useRef } from 'react';
import { Stage, Layer } from 'react-konva'
import bg from '../../../assets/bg-canvas.jpg'
import TextObject from './Objects/TextObject'
import ImageObject from './Objects/ImageObject'

const CanvasStage = ({ objects, setSelectedId, updateObject, selectedId, onDelete }) => {
  const stageRef = useRef(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };
  return (
    <Stage
      width={400}
      height={500}
      style={{
        border: '1px dashed gray',
        backgroundImage: `url(${bg})`,
        
      }}
    >
      <Layer>
      {objects.map((obj) =>
          obj.type === 'text' ? (
            <TextObject
              obj={obj}
              onSelect={handleSelect}
              onUpdate={updateObject}
              isSelected={selectedId === obj.id}
            />
          ) : (
            <ImageObject
              obj={obj}
              onSelect={handleSelect}
              onUpdate={updateObject}
              isSelected={selectedId === obj.id}
              onDelete={onDelete}
            />
          )
        )}
      </Layer>

    </Stage>
  )
}

export default CanvasStage