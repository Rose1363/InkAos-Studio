import TextDesignModel from "../models/textDesign.model.js";

export const saveTextDesign = async (request, response) => {
  try {
    const {
      width_text,
      height_text,
      position_x_text,
      position_y_text,
      color_text,
      size_text,
      text,
      fontFamily,
      align,
      fontStyle,
      textDecoration,
      rotation,
      scaleX,
      scaleY,
      x, 
      y, 
      fill, 
      fontSize, 
    } = request.body;

    // Tạo object TextDesign với các giá trị từ request.body
    const textDesignData = {
      width_text: width_text || 200, 
      height_text: height_text || 50, 
      position_x_text: position_x_text || x, 
      position_y_text: position_y_text || y,
      color_text: color_text || fill, 
      size_text: size_text || fontSize, 
      text, 
      fontFamily, 
      align: align || "left", 
      fontStyle: fontStyle || "", 
      textDecoration: textDecoration || "", 
      rotation: rotation || 0, 
      scaleX: scaleX || 1, 
      scaleY: scaleY || 1, 
    };

    // Kiểm tra các trường bắt buộc
    if (!textDesignData.position_x_text) {
      return response.status(400).json({
        message: "position_x_text or x is required",
        error: true,
        success: false,
      });
    }
    if (!textDesignData.position_y_text) {
      return response.status(400).json({
        message: "position_y_text or y is required",
        error: true,
        success: false,
      });
    }
    if (!textDesignData.color_text) {
      return response.status(400).json({
        message: "color_text or fill is required",
        error: true,
        success: false,
      });
    }
    if (!textDesignData.size_text) {
      return response.status(400).json({
        message: "size_text or fontSize is required",
        error: true,
        success: false,
      });
    }
    if (!textDesignData.text) {
      return response.status(400).json({
        message: "text is required",
        error: true,
        success: false,
      });
    }
    if (!textDesignData.fontFamily) {
      return response.status(400).json({
        message: "fontFamily is required",
        error: true,
        success: false,
      });
    }

    // Lưu TextDesign vào cơ sở dữ liệu
    const textDesign = new TextDesignModel(textDesignData);
    await textDesign.save();

    return response.status(201).json({
      message: "TextDesign saved successfully",
      data: textDesign,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};