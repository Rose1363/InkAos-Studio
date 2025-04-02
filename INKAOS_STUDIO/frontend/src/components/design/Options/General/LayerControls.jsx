import React from 'react'
import { RiBringToFront } from "react-icons/ri";
import { RiSendToBack } from "react-icons/ri";
const LayerControls = ({objects, setObjects, selectedId}) => {
  
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

  return (
    <div >
      <label className="block mb-1">Layer</label>
       <div className='flex items-center gap-2'>
          <button 
          onClick={bringToFront}
          className='border rounded p-1'>
              <RiBringToFront size={30}/>
              
          </button>
      
          <button 
          onClick={sendToBack}
          className='border rounded p-1'>
              <RiSendToBack size={30}/>
          </button>
       </div>
    </div>
  )
}

export default LayerControls