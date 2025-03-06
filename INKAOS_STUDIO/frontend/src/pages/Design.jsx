import React from 'react'
import DesignMenuBar from '../components/design/Menu/DesignMenu'
import { useState } from 'react'
import TextInput from '../components/design/Menu/Inputs/DesignTextInput'
import ImageInput from '../components/design/Menu/Inputs/ImageUploadInput'
import TypeShirtInput from '../components/design/Menu/Inputs/ShirtTypeInput'
import CanvasContainer from '../components/design/Canvas/CanvasContainer'
import OptionsPanel from '../components/design/Options/OptionsPanel'
const Design = () => {
  const [activePanel, setActivePanel] = useState(null);
  const [objects, setObjects] = useState([])
  const [selectedId, setSelectedId] = useState(null);
  const [typeShirt, setTypeShirt] = useState('tanktop');
  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  } 

  const deleteObject = (id) => {
    setObjects(objects.filter((obj) => obj.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateObject = (id, updates) => {
    setObjects(
      objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  };

  const addText = (text) => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text',
      text,
      x: 100,
      y: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      align: 'left',
      fontStyle: '',
      textDecoration: '',
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
              type: 'image',
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
    if(selectedId){
      const selectedIndex = objects.findIndex((obj) => obj.id === selectedId)
      if(selectedIndex !== -1 && selectedIndex < objects.length-1){
        const newObjects = [...objects]
        const [selected] = newObjects.splice(selectedIndex,1)
        newObjects.push(selected)
        setObjects(newObjects)
      }
    }
  }

  const sendToBack = () => {
    if(selectedId){
      const selectedIndex = objects.findIndex((obj) => obj.id === selectedId)
      if(selectedIndex !== -1 && selectedIndex > 0){
        const newObjects = [...objects]
        const [selected] = newObjects.splice(selectedIndex,1)
        newObjects.unshift(selected)
        setObjects(newObjects)
      }
    }
  }

  const handleTypeShirtChange = (type) => {
    setTypeShirt(type)
  }
  return (
    <div className='flex h-screen'>
      <DesignMenuBar togglePanel={togglePanel}/>
      {
        activePanel && (
          <div className='bg-slate-50 w-80'>
            {activePanel === 'text' && <TextInput addText={addText}/>}
            {activePanel === 'upload' && <ImageInput handleImageUpload={handleImageUpload}/>}
            {activePanel === 'typeshirt' && <TypeShirtInput handleTypeShirtChange={handleTypeShirtChange}/>}
          </div>
        )
      }
     <CanvasContainer
        objects={objects}
        setSelectedId={setSelectedId}
        updateObject={updateObject}
        activePanel={activePanel}
        selectedId={selectedId}
        onDelete={deleteObject}
        typeShirt={typeShirt}
      />
      {selectedId && (
        <div className='w-90 bg-gray-50 p-4'>
          <OptionsPanel
            selectedObject={objects.find((obj)=> obj.id === selectedId)|| {}}
            updateObject={(updates) => updateObject(selectedId, updates)}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
          />
        </div>
      )}
    </div>
  )
}

export default Design