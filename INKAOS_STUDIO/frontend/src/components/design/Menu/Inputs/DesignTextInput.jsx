import React, { useState } from 'react'

const TextInput = ({addText}) => {
  const [text, setText] = useState('')
  const handelSubmit = (e) => {
    e.preventDefault();
    if(text){
      addText(text)
      setText('')
    }

  }
  return (
    <form 
      onSubmit={handelSubmit}
      className='p-4'
    >
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Nhap van ban ...'
        className='border border-gray-400 h-10 w-full p-2 mb-3'
      />

      <button className='border bg-blue-300 h-10 w-full p-2'>
        Them van ban
      </button>
    </form>
  )
}

export default TextInput