// import { React, useState, useRef } from "react";

// const ImageInput = ({ handleImageUpload }) => {
//   const [uploadedImages, setUploadedImages] = useState([]);

//   const fileInputRef = useRef(null);

//   const handleButtonClick = (e) => {
//     e.preventDefault();
//     fileInputRef.current.click();
//   };

//   //  Xử lý khi chọn file
//   const handleChange = async (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file); // Tạo URL để hiển thị ảnh
//       setUploadedImages((prev) => [...prev, imageUrl]); // Thêm URL của ảnh vào danh sách
//       handleImageUpload(e); // Gọi hàm upload từ parent
//     }
//   };

//   //  const handleChange = async (e) => {
//   //   console.log('Event triggered:', e);
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   try {
//   //     console.log('Uploading file:', file.name);
//   //     const response = await uploadImage(file);
//   //     console.log('Upload response:', response);
//   //     if (response?.data?.data?.imageUrl) {
//   //       const imageUrl = response.data.data.imageUrl;
//   //       console.log('Image URL:', imageUrl);
//   //       setUploadedImages((prev) => [...prev, imageUrl]);
//   //       handleImageUpload(e);
//   //     } else {
//   //       console.log('Failed to upload image. Response:', response);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error uploading image:', error.response?.data || error);
//   //   }
//   // };

//   const handleImageClick = (imageUrl) => {
//     e.preventDefault();
//     const img = new window.Image();
//     img.src = imageUrl;
//     img.onload = () => {
//       const newImage = {
//         id: `image-${Date.now()}`,
//         type: "image",
//         image: img,
//         x: 100,
//         y: 100,
//         scaleX: 0.5,
//         scaleY: 0.5,
//         draggable: true,
//       };
//       handleImageUpload(null, newImage);
//     };
//   };
//   return (
//     <div className="p-3">
//       <button
//         type="button"
//         className="border p-2 w-full bg-blue-500 text-white rounded"
//         onClick={handleButtonClick}
//       >
//         Chọn Ảnh Từ Máy
//       </button>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleChange}
//         ref={fileInputRef}
//         className="w-full"
//         hidden
//       />

//       {uploadedImages.length > 0 && (
//         <div className="mt-4 grid grid-cols-2 gap-4">
//           {uploadedImages.map((imageUrl, index) => (
//             <div
//               key={index}
//               className="w-full cursor-pointer"
//               onClick={() => handleImageClick(imageUrl)}
//             >
//               <img
//                 src={imageUrl}
//                 alt={`Uploaded ${index}`}
//                 className="w-full h-auto object-cover rounded-md"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageInput;
import { React, useState, useRef } from 'react';

const ImageInput = ({ handleImageUpload }) => {
  const [uploadedImages, setUploadedImages] = useState([]); 
  const fileInputRef = useRef(null); 

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  // Xử lý khi chọn file
  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL để hiển thị ảnh
      setUploadedImages((prev) => [...prev, imageUrl]); // Thêm URL của ảnh vào danh sách
      handleImageUpload(e); // Gọi hàm upload từ parent
    }
  };

  const handleImageClick = (imageUrl) => {
    e.preventDefault(); // Bạn có thể bỏ qua e.preventDefault() ở đây nếu không cần thiết.
    const img = new window.Image();
    img.src = imageUrl;
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
      handleImageUpload(null, newImage); 
    };
  };

  return (
    <div className='p-3'>
      <button
        type="button"  
        className="border p-2 w-full bg-blue-500 text-white rounded"
        onClick={handleButtonClick}
      >
        Chọn Ảnh Từ Máy
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        className="w-full"
        hidden
      />

      {uploadedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div
              key={index}
              className="w-full cursor-pointer"
              onClick={() => handleImageClick(imageUrl)} 
            >
              <img
                src={imageUrl}
                alt={`Uploaded ${index}`}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageInput;
