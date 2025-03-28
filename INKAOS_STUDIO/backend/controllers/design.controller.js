import DesignModel from '../models/design.model.js';

// Thêm mới hoặc cập nhật design
export const addDesign = async (req, res) => {
    try {
        // Chuẩn bị dữ liệu design
        const designData = {
          name: req.body.name,
          userId: req.body.userId,
          style: req.body.style,
          elements: req.body.elements || [], // Default là array rỗng nếu không có elements
          canvasWidth: req.body.canvasWidth || 400,
          canvasHeight: req.body.canvasHeight || 500,
          basePrice: req.body.basePrice || 0,
          isPublic: req.body.isPublic || false,
          tags: req.body.tags || [],
          // Khởi tạo history với action create
          history: [{
            elements: req.body.elements || [],
            timestamp: new Date(),
            action: 'create'
          }]
        };
    
        // Tạo và lưu design
        const design = new DesignModel(designData);
        const savedDesign = await design.save();
    
        // Response thành công
        res.status(201).json({
          success: true,
          message: 'Tạo design thành công',
          data: {
            id: savedDesign._id,
            name: savedDesign.name,
            userId: savedDesign.userId,
            style: savedDesign.style,
            elementsCount: savedDesign.elements.length,
            createdAt: savedDesign.createdAt
          }
        });
      } catch (error) {
        // Xử lý lỗi
        res.status(400).json({
          success: false,
          message: 'Không thể tạo design',
          error: error.message,
          details: error.errors // Chi tiết lỗi từ Mongoose validation
        });
      }
    }


export const getDesign = async(request, response)=>{
  try {
    
  } catch (error) {
    
  }
}