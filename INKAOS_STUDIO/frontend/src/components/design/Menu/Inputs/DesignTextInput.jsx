import React, { useState } from 'react';

const TextInput = ({ addText }) => {
  const [text, setText] = useState('');

 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      addText(text);  
      setText('');    
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập văn bản ..."
        className="border border-gray-400 h-10 w-full p-2 mb-3"
      />

      <button 
        className={`h-10 w-full p-2 ${!text ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={!text}  // Vô hiệu hóa nút nếu không có text
      >
        Thêm văn bản
      </button>
    </form>
  );
};

export default TextInput;
