import React from 'react'
import { HiMiniBold, HiMiniItalic, HiUnderline } from "react-icons/hi2";
const StyleSettings = ({selectedObject, updateObject}) => {
  const handleChangeStyle = (styleType) => {
    let newFontStyle = selectedObject.fontStyle || '';
    let newTextDecoration = selectedObject.textDecoration || '';

    switch(styleType){
      case 'bold':
        newFontStyle = newFontStyle.includes('bold')
          ? newFontStyle.replace('bold', '').trim()
          : newFontStyle.includes('italic') 
          ? 'bold italic'
          : 'bold';
        break;
      case 'italic':
        newFontStyle = newFontStyle.includes('italic')
          ? newFontStyle.replace('italic', '').trim()
          : newFontStyle.includes('bold') 
          ? 'bold italic'
          : 'italic'
        break;
      case 'underline':
        newTextDecoration = newTextDecoration.includes('underline') 
          ? '' 
          : 'underline'
        break;
      default:
        break;
    }
    updateObject({
      fontStyle: newFontStyle,
      textDecoration: newTextDecoration
    })
  }
  return (
    <div className="mb-2">
    <h3 className="mb-2">Kiểu chữ</h3>
    <div className="flex gap-2">
      {/* Nút Bold */}
      <button
        onClick={() => handleChangeStyle('bold')}
        className={`p-2 border rounded ${selectedObject.fontStyle?.includes('bold') ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="In đậm"
      >
        <HiMiniBold />
      </button>

      {/* Nút Italic */}
      <button
        onClick={() => handleChangeStyle('italic')}
        className={`p-2 border rounded ${selectedObject.fontStyle?.includes('italic') ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="In nghiêng"
      >
        <HiMiniItalic />
      </button>

      {/* Nút Underline */}
      <button
        onClick={() => handleChangeStyle('underline')}
        className={`p-2 border rounded ${selectedObject.textDecoration?.includes('underline') ? 'bg-blue-200' : 'bg-white'} hover:bg-gray-100`}
        title="Gạch chân"
      >
        <HiUnderline />
      </button>
    </div>
  </div>
  )
}

export default StyleSettings