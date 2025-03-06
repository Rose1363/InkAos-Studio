import React from 'react'
import { RiBringToFront } from "react-icons/ri";
import { RiSendToBack } from "react-icons/ri";
const LayerControls = ({bringToFront, sendToBack}) => {
  return (
    <div >
      <label className="block mb-1">Layer</label>
       <div className='flex items-center gap-2'>
          <button className='border rounded p-1'>
              <RiBringToFront size={30}/>
          </button>
      
          <button className='border rounded p-1'>
              <RiSendToBack size={30}/>
          </button>
       </div>
    </div>
  )
}

export default LayerControls