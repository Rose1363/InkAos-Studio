import DesignModel from "../models/design.model.js";

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
      thumbnail: req.body.thumbnail,
    };

    // Tạo và lưu design
    const design = new DesignModel(designData);
    const savedDesign = await design.save();

    // Response thành công
    res.status(201).json({
      success: true,
      message: "Tạo design thành công",
      data: savedDesign,
    });
  } catch (error) {
    // Xử lý lỗi
    res.status(400).json({
      success: false,
      message: "Không thể tạo design",
      error: error.message,
      details: error.errors, // Chi tiết lỗi từ Mongoose validation
    });
  }
};

export const getDesign = async (request, response) => {
  try {
    const userId = request.userId; // Lấy từ middleware auth
    
    // Sử dụng giá trị mặc định ngay từ destructuring
    let { page = 1, limit = 6, search } = request.body;

    // Chuyển page và limit thành số nguyên
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Xây dựng truy vấn: luôn lọc theo userId, thêm $text nếu có search
    const query = { userId };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Thực hiện truy vấn và đếm tổng số tài liệu cùng lúc
    const [data, totalCount] = await Promise.all([
      DesignModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      DesignModel.countDocuments(query), // Đếm dựa trên query (bao gồm cả search nếu có)
    ]);

    return response.json({
      message: "Design Data",
      error: false,
      success: true,
      data: data,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};
