import React from 'react'
import MenuButton from './MenuButton'
import { LuTypeOutline } from "react-icons/lu";
import { ImUpload } from "react-icons/im";
import { PiTShirtDuotone } from "react-icons/pi";
const DesignMenuBar = ({togglePanel}) => {
  return (
    <div className='bg-gray-800 z-100 w-25 py-5 text-white h-full flex flex-col items-center'>
        <MenuButton
        icon={<LuTypeOutline size={27}/>}
        lable="van ban"
        title="Nhap van ban"
        hoverColor="amber-300"
        onClick={() => togglePanel('text')}
        />
        <MenuButton
        icon={<ImUpload size={27}/>}
        lable="tai len"
        title="len hinh anh tu may"
        hoverColor="blue-400"
        onClick={() => togglePanel('upload')}
        />
        <MenuButton
        icon={<PiTShirtDuotone size={29}/>}
        lable="loai ao"
        title="chon loai ao"
        hoverColor="pink-300"
        onClick={() => togglePanel('typeshirt')}
        />
    </div>
  )
}

export default DesignMenuBar