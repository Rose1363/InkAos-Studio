import React from 'react';
import CanvasStage from './CanvasStage';
import tshirtPhoto from '../../../assets/photo.png';
import hoodie from '../../../assets/hoodi.png';
import tankTop from '../../../assets/tanktop.jpg';

const CanvasContainer = ({
  objects,
  setSelectedId,
  updateObject,
  activePanel,
  selectedId,
  onDelete,
  typeShirt,  // Receive the typeShirt prop
}) => {
  const baseContainerWidth = 800;
  const containerHeight = 900;

  const isLeftPanelOpen = !!activePanel;
  const isRightPanelOpen = !!selectedId;
  const panelWidth = 90;
  const containerWidth = baseContainerWidth - 
    (isLeftPanelOpen ? panelWidth : 0) - 
    (isRightPanelOpen ? panelWidth : 0);

  const canvasWidth = containerWidth * 0.5375;
  const canvasHeight = 500;
  const canvasX = (containerWidth - canvasWidth) / 2;
  const canvasY = (containerHeight - canvasHeight) / 2;

  const getBackgroundImage = () => {
    switch (typeShirt) {
      case 'hoodie':
        return `url(${hoodie})`;
      case 'tanktop':
        return `url(${tankTop})`;
      case 'tshirt':
      default:
        return `url(${tshirtPhoto})`;
    }
  };

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div
        className='relative bg-amber-700 bg-cover bg-center h-[900px]'
        style={{
          backgroundImage: getBackgroundImage(),
          width: `${containerWidth}px`,
        }}
      >
        <div
          className='absolute'
          style={{
            top: `${canvasY}px`,
            left: `${canvasX}px`,
          }}
        >
          <CanvasStage
            objects={objects}
            setSelectedId={setSelectedId}
            updateObject={updateObject}
            selectedId={selectedId}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasContainer;
