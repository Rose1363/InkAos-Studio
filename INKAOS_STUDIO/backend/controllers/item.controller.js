import ItemModel from "../models/Item.model.js";

export const getPublicItemsController = async (request, response) => {
  try {
    const { categoryId } = request.query; // Lấy categoryId từ query params

    // Tạo điều kiện truy vấn
    const query = { isPublic: true };
    if (categoryId) {
      query.category = categoryId; // Lọc theo danh mục
    }

    const items = await ItemModel.find(query)
      .populate("productId")
      .populate("designId")
      .populate("variantId")
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)

    return response.json({
      success: true,
      error: false,
      data: items,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Có lỗi xảy ra",
      error: true,
      success: false,
    });
  }
};