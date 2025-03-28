// import ProductModel from "../models/product.model.js";

// export const addProductController = async (request, response) => {
//   try {
//     const {
//       name,
//       image,
//       category,
//       price,
//       subCategory,
//     //   material,
//       promotion,
//       description,
//       variants,
//     } = request.body;

//     if (
//       !name ||
//       !image[0] ||
   
//       !subCategory ||
      
//       !price ||
      
//     //   !material ||
//       !promotion ||
//       !description ||
//       !variants
//     ) {
//       return response.status(400).json({
//         message: "Enter required fields",
//         error: true,
//         success: false,
//       });
//     }

//     const newProduct = new ProductModel({
//       name,
//       image,
//       category,
//       price,
//       subCategory,
//     //   material,
//       promotion,
//       description,
//       variants,
//     });

//     const saveProduct = await newProduct.save();

//     return response.json({
//       data: saveProduct,
//       success: true,
//       error: false,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// export const getProductController = async (request, response) => {
//   try {
//     const data = await ProductModel.find();
//     return response.json({
//       data: data,
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

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
    const { id } = request.params;
    const { subCategory, limit = 10, page = 1, sortBy = "createdAt", sortOrder = "desc", populate = "variants" } = request.query;

    // Kiểm tra tính hợp lệ của ID nếu có
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "ID không hợp lệ",
        error: true,
        success: false,
      });
    }
    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
      return response.status(400).json({
        message: "SubCategory ID không hợp lệ",
        error: true,
        success: false,
      });
    }

    // Xây dựng query
    const query = {};
    if (id) query._id = id;
    if (subCategory) query.subCategory = subCategory;

    // Phân trang
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit);

    // Sắp xếp
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Xử lý populate động
    const populateFields = populate.split(",");
    const queryBuilder = ProductModel.find(query);

    if (populateFields.includes("variants")) {
      queryBuilder.populate({
        path: "variants",
        select: "color colorCode sizes",
      });
    }
    if (populateFields.includes("category")) {
      queryBuilder.populate("category", "name");
    }
    if (populateFields.includes("subCategory")) {
      queryBuilder.populate("subCategory", "name");
    }
    if (populateFields.includes("design")) {
      queryBuilder.populate("design", "name image");
    }

    // Thực thi truy vấn
    const products = await queryBuilder
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalProducts = await ProductModel.countDocuments(query);

    return response.json({
      data: products,
      success: true,
      error: false,
      pagination: {
        total: totalProducts,
        page: parseInt(page),
        limit: limitNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};