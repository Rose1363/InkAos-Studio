import {React, useState, useRef} from 'react';

const ImageInput = ({ handleImageUpload }) => {
 const [uploadedImages, setUploadedImages] = useState([]); // Lưu danh sách ảnh đã tải lên
   const fileInputRef = useRef(null); // Ref để kích hoạt input file
 
   // Xử lý khi nhấn nút để mở file picker
   const handleButtonClick = () => {
     fileInputRef.current.click();
   };
 
   // Xử lý khi chọn file
   const handleChange = (e) => {
     const file = e.target.files[0];
     if (file) {
       const imageUrl = URL.createObjectURL(file); // Tạo URL để hiển thị ảnh
       setUploadedImages((prev) => [...prev, imageUrl]); // Thêm URL của ảnh vào danh sách
       handleImageUpload(e); // Gọi hàm upload từ parent
     }
   };
 
   // Xử lý khi nhấp vào ảnh đã tải lên để thêm vào Canvas
   const handleImageClick = (imageUrl) => {
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
       handleImageUpload(null, newImage); // Gọi lại với đối tượng ảnh mới
     };
   };
   return (
     <div className='p-3'>
       <button
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
       {/* Hiển thị ảnh đã tải lên */}
       {uploadedImages.length > 0 && (
         <div className="mt-4 grid grid-cols-2 gap-4">
         {uploadedImages.map((imageUrl, index) => (
           <div
             key={index}
             className="w-full cursor-pointer"
             onClick={() => handleImageClick(imageUrl)} // Thêm ảnh vào Canvas khi nhấp
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