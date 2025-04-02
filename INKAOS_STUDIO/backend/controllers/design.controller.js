import DesignModel from "../models/design.model.js";
import mongoose from "mongoose";

export const addDesign = async (req, res) => {
  try {
    const { name, userId, elements, canvasWidth, canvasHeight, basePrice, isPublic, tags, thumbnail, styleDesign } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        message: "Tên và userId là bắt buộc",
      });
    }

    // Kiểm tra userId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ",
      });
    }

    // Chuẩn bị dữ liệu design
    const designData = {
      name,
      userId,
      elements: elements || [],
      canvasWidth: canvasWidth || 400,
      canvasHeight: canvasHeight || 500,
      basePrice: basePrice >= 0 ? basePrice : 0, // Đảm bảo basePrice không âm
      isPublic: typeof isPublic === "boolean" ? isPublic : false, // Đảm bảo kiểu dữ liệu
      tags: Array.isArray(tags) ? tags : [],
      thumbnail: thumbnail || undefined, // Dùng giá trị mặc định của schema nếu không có
      styleDesign: styleDesign || undefined,
    };

    // Tạo và lưu design
    const design = new DesignModel(designData);
    const savedDesign = await design.save();

    // Response thành công
    return res.status(201).json({
      success: true,
      message: "Tạo design thành công",
      data: savedDesign,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Không thể tạo design",
      error: error.message,
      details: error.errors || "Không có chi tiết lỗi",
    });
  }
};

export const getDesign = async (request, response) => {
  try {
    const userId = request.userId; // Giả sử userId được lấy từ middleware auth
    let { page = 1, limit = 6, search, styleDesign } = request.body;

    // Kiểm tra dữ liệu đầu vào
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (page < 1 || limit < 1) {
      return response.status(400).json({
        message: "Page và limit phải lớn hơn 0",
        error: true,
        success: false,
      });
    }

    // Xây dựng truy vấn
    const query = { userId };
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Thay $text bằng $regex
    }
    if (styleDesign) {
      if (!mongoose.Types.ObjectId.isValid(styleDesign)) {
        return response.status(400).json({
          message: "styleDesign không hợp lệ",
          error: true,
          success: false,
        });
      }
      query.styleDesign = styleDesign;
    }

    const skip = (page - 1) * limit;

    // Thực hiện truy vấn
    const [data, totalCount] = await Promise.all([
      DesignModel.find(query)
        .populate("styleDesign", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Tối ưu hiệu suất
      DesignModel.countDocuments(query),
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


export const getDesignByStyle = async (request, response) => {
  try {
    const { id } = request.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id) {
      return response.status(400).json({
        message: "Không có ID style",
        error: true,
        success: false,
      });
    }

    const ids = Array.isArray(id) ? id : [id]; // Hỗ trợ cả chuỗi và mảng
    if (!ids.every((styleId) => mongoose.Types.ObjectId.isValid(styleId))) {
      return response.status(400).json({
        message: "Một hoặc nhiều ID style không hợp lệ",
        error: true,
        success: false,
      });
    }

    // Truy vấn
    const design = await DesignModel.find({
      styleDesign: { $in: ids },
    })
      .limit(10)
      .lean();

    return response.json({
      message: "Style design list",
      error: false,
      success: true,
      data: design,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};



export const getPublicDesigns = async (request, response) => {
  try {
    let { page = 1, limit = 12, search, styleDesign } = request.body;

    // Kiểm tra dữ liệu đầu vào
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (page < 1 || limit < 1) {
      return response.status(400).json({
        message: "Page và limit phải lớn hơn 0",
        error: true,
        success: false,
      });
    }

    // Xây dựng truy vấn
    const query = { isPublic: true };
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Thay $text bằng $regex
    }
    if (styleDesign) {
      if (!mongoose.Types.ObjectId.isValid(styleDesign)) {
        return response.status(400).json({
          message: "styleDesign không hợp lệ",
          error: true,
          success: false,
        });
      }
      query.styleDesign = styleDesign;
    }

    const skip = (page - 1) * limit;

    // Thực hiện truy vấn
    const [data, totalCount] = await Promise.all([
      DesignModel.find(query)
        .populate("styleDesign", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DesignModel.countDocuments(query),
    ]);

    return response.json({
      message: "Public Designs Data",
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

export const getDesignDetail = async (request, response) => {
  try {
    const { designId } = request.body;

    // Kiểm tra designId
    if (!designId || !mongoose.Types.ObjectId.isValid(designId)) {
      return response.status(400).json({
        message: "ID thiết kế không hợp lệ",
        success: false,
        error: true,
      });
    }

    // Truy vấn
    const design = await DesignModel.findOne({ _id: designId })
      .populate("styleDesign", "name")
      .lean();

    if (!design) {
      return response.status(404).json({
        message: "Không tìm thấy thiết kế",
        success: false,
        error: true,
      });
    }

    return response.json({
      message: "Design detail",
      success: true,
      error: false,
      data: design,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const updateDesign = async (request, response) => {
  try {
    const { designId, name, elements, canvasWidth, canvasHeight, basePrice, isPublic, tags, thumbnail, styleDesign } = request.body;

    // Kiểm tra designId
    if (!designId || !mongoose.Types.ObjectId.isValid(designId)) {
      return response.status(400).json({
        success: false,
        message: "ID thiết kế không hợp lệ",
        error: true,
      });
    }

    // Xây dựng dữ liệu cập nhật
    const updateData = {};
    if (name) updateData.name = name;
    if (elements !== undefined) updateData.elements = Array.isArray(elements) ? elements : []; // Đảm bảo là mảng
    if (canvasWidth !== undefined) updateData.canvasWidth = canvasWidth;
    if (canvasHeight !== undefined) updateData.canvasHeight = canvasHeight;
    if (basePrice !== undefined) updateData.basePrice = basePrice >= 0 ? basePrice : 0; // Đảm bảo không âm
    if (typeof isPublic === "boolean") updateData.isPublic = isPublic; // Chỉ cập nhật nếu là boolean
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (styleDesign !== undefined) {
      if (Array.isArray(styleDesign) && styleDesign.every(id => mongoose.Types.ObjectId.isValid(id))) {
        updateData.styleDesign = styleDesign;
      } else if (mongoose.Types.ObjectId.isValid(styleDesign)) {
        updateData.styleDesign = [styleDesign]; // Chuyển thành mảng nếu là chuỗi
      } else if (styleDesign !== null) {
        return response.status(400).json({
          success: false,
          message: "styleDesign không hợp lệ",
          error: true,
        });
      }
    }

    // Kiểm tra xem có dữ liệu để cập nhật không
    if (Object.keys(updateData).length === 0) {
      return response.status(400).json({
        success: false,
        message: "Không có dữ liệu nào để cập nhật",
        error: true,
      });
    }

    // Cập nhật design
    const updatedDesign = await DesignModel.findOneAndUpdate(
      { _id: designId },
      { $set: updateData },
      { new: true, runValidators: true } // Trả về tài liệu mới và chạy validation
    ).lean();

    // Kiểm tra xem design có tồn tại không
    if (!updatedDesign) {
      return response.status(404).json({
        success: false,
        message: "Không tìm thấy thiết kế để cập nhật",
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      message: "Cập nhật design thành công",
      data: updatedDesign,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
      error: true,
      details: error.errors || "Không có chi tiết lỗi",
    });
  }
};