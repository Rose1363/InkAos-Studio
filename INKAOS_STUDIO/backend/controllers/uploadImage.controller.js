import ImageModel from "../models/image.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

export const uploadImageController = async (request, response) => {
  try {
    // Kiểm tra file
    // if (!request.file) {
    //   return response.status(400).json({
    //     message: "No file uploaded",
    //     error: true,
    //     success: false,
    //   });
    // }

    // console.log("File received:", request.file);

    // // Upload ảnh lên Cloudinary
    // const uploadImage = await uploadImageCloudinary(request.file);
    // if (!uploadImage?.secure_url) {
    //   return response.status(500).json({
    //     message: "Failed to upload image to Cloudinary",
    //     error: true,
    //     success: false,
    //   });
    // }

    
    // const newImage = new ImageModel({
    //   image: uploadImage.secure_url, 
    // });
    // await newImage.save();

    // // Trả về response thành công
    // return response.status(200).json({
    //   message: "Image uploaded successfully",
    //   data: {
    //     imageUrl: uploadImage.secure_url,
    //   },
    //   error: false,
    //   success: true,
    // });

    const file = request.file
   const uploadImage = await uploadImageCloudinary(file)
return response.json({
      message: "Image uploaded successfully",
      data: uploadImage,
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};