

import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import VariantModel from "../models/variant.model.js";
import DesignModel from "../models/design.model.js";

export const addProductController = async (request, response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      image,
      category,
      subCategory,
      basePrice,
      material,
      description,
      variants,
      design,
      designPlacement,
    } = request.body;

    // Kiểm tra các trường bắt buộc
    if (
      !name ||
      !image?.length ||
      !category || // Thêm category vào kiểm tra
      !subCategory ||
      !basePrice ||
      !description ||
      !variants?.length
    ) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        error: true,
        success: false,
      });
    }

    // Kiểm tra tính hợp lệ của ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(category) ||
      !mongoose.Types.ObjectId.isValid(subCategory) ||
      (design && !mongoose.Types.ObjectId.isValid(design))
    ) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).json({
        message: "Category, SubCategory hoặc Design ID không hợp lệ",
        error: true,
        success: false,
      });
    }

    // Validate variants
    const invalidVariants = variants.some((v) =>
      !v.color ||
      !v.sizes?.length ||
      v.sizes.some((s) =>
        !s.name ||
        isNaN(s.price) ||
        s.price < 0 ||
        isNaN(s.stock) ||
        s.stock < 0
      )
    );

    if (invalidVariants) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).json({
        message: "Biến thể phải có màu sắc và kích thước hợp lệ (giá và tồn kho không âm)",
        error: true,
        success: false,
      });
    }

    // Tạo product trước
    const newProduct = new ProductModel({
      name,
      image,
      category,
      subCategory,
      basePrice: Number(basePrice),
      material: material || null,
      description,
      variants: [], // Tạm thời để rỗng
      design: design || null,
      designPlacement: designPlacement || { x: 0.5, y: 0.3, scale: 1.0 },
    });

    const savedProduct = await newProduct.save({ session });

    // Tạo variants
    const createdVariants = await Promise.all(
      variants.map(async (variant) => {
        const newVariant = new VariantModel({
          product: savedProduct._id,
          color: variant.color,
          colorCode: variant.colorCode || "#000000",
          sizes: variant.sizes.map((size) => ({
            name: size.name,
            price: Number(size.price) || Number(basePrice),
            stock: Number(size.stock) || 0,
          })),
        });
        return await newVariant.save({ session });
      })
    );

    // Cập nhật product với variant IDs
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      savedProduct._id,
      { variants: createdVariants.map((v) => v._id) },
      { new: true, session }
    )
      .populate({
        path: "variants",
        select: "color colorCode sizes",
      })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("design", "name image"); // Chỉ lấy các trường cần thiết từ design

    await session.commitTransaction();
    session.endSession();

    return response.status(201).json({
      data: updatedProduct,
      success: true,
      error: false,
      message: "Thêm sản phẩm thành công",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi thêm sản phẩm:", error);
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};


export const getProductController = async (request, response) => {
  try {
    // Lấy các tham số từ request.body với giá trị mặc định
    let { page = 1, limit = 6, search, category, subCategory } = request.body;

    // Chuyển đổi page và limit thành số nguyên
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Xây dựng query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Tìm theo tên sản phẩm
        { description: { $regex: search, $options: "i" } }, // Tìm theo mô tả (nếu cần)
      ];
    }
    if (category) {
      query.category = category; // Lọc theo category (ObjectId)
    }
    if (subCategory) {
      query.subCategory = subCategory; // Lọc theo subCategory (ObjectId)
    }

    // Tính skip cho phân trang
    const skip = (page - 1) * limit;

    // Truy vấn dữ liệu với populate
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .populate("category", "name") // Populate tên category
        .populate("subCategory", "name") // Populate tên subCategory
        .populate({
          path: "variants",
          populate: { path: "sizes" }, // Populate sizes trong variants nếu có
        })
        .populate("design", "name image") // Populate thông tin design (nếu cần)
        .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
        .skip(skip)
        .limit(limit)
        .lean(), // Chuyển sang plain object để tối ưu
      ProductModel.countDocuments(query), // Đếm tổng số tài liệu
    ]);

    // Trả về phản hồi
    return response.json({
      message: "Product Data",
      error: false,
      success: true,
      data: data.map(product => ({
        ...product,
        totalStock: product.totalStock || 0, // Đảm bảo totalStock luôn có giá trị
      })),
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error in getProductController:", error);
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async(request, response)=>{
  try {
    const {id} = request.body

    if(!id){
      return response.status(400).json({
        message: "khong co id category",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.find({
      category: { $in : id}
    }).limit(10)

    return response.json({
      message: "Category product list",
      error: false,
      success: true,
      data: product
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
}
// controllers/productController.js
// export const getProductByCategory = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID danh mục không hợp lệ",
//       });
//     }

//     // Verify category exists
//     const categoryExists = await CategoryModel.exists({ _id: id });
//     if (!categoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy danh mục",
//       });
//     }

//     const products = await ProductModel.find({ category: id })
//       .limit(10)
//       .populate('category', 'name')
//       .populate('subCategory', 'name');

//     return res.json({
//       success: true,
//       data: products,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi server",
//     });
//   }
// }