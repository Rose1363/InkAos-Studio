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
      basePrice,
      material,
      description,
      variants,
      design,
      designPlacement,
    } = request.body;

    if (
      !name ||
      !image?.length ||
      !category ||
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

    if (
      !mongoose.Types.ObjectId.isValid(category) ||
      (design && !mongoose.Types.ObjectId.isValid(design))
    ) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).json({
        message: "Category hoặc Design ID không hợp lệ",
        error: true,
        success: false,
      });
    }

    // Validate variants (giữ nguyên)
    const invalidVariants = variants.some(
      (v) =>
        !v.color ||
        !v.sizes?.length ||
        v.sizes.some(
          (s) =>
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
        message:
          "Biến thể phải có màu sắc và kích thước hợp lệ (giá và tồn kho không âm)",
        error: true,
        success: false,
      });
    }

    const newProduct = new ProductModel({
      name,
      image,
      category,
      basePrice: Number(basePrice),
      material: material || null,
      description,
      variants: [],
      design: design || null,
      designPlacement: designPlacement || { x: 0.5, y: 0.3, scale: 1.0 },
    });

    const savedProduct = await newProduct.save({ session });

    // Tạo variants (giữ nguyên)
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
      .populate("design", "name image");

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
    let { page = 1, limit = 6, search, category } = request.body;

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

    // Tính skip cho phân trang
    const skip = (page - 1) * limit;

    // Truy vấn dữ liệu với populate
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .populate("category", "name") // Populate tên category
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

    // Tính totalStock cho mỗi sản phẩm
    const productsWithTotalStock = data.map((product) => {
      const totalStock = product.variants.reduce((variantTotal, variant) => {
        const sizesTotal = variant.sizes.reduce((sizeTotal, size) => {
          return sizeTotal + (size.stock || 0); // Cộng stock của từng size, mặc định 0 nếu không có
        }, 0);
        return variantTotal + sizesTotal;
      }, 0);

      return {
        ...product,
        totalStock, // Thêm totalStock vào dữ liệu sản phẩm
      };
    });

    // Trả về phản hồi
    return response.json({
      message: "Product Data",
      error: false,
      success: true,
      data: productsWithTotalStock,
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

export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "khong co id category",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(10).populate("category", "name") // Populate tên category
    .populate({
      path: "variants",
      populate: { path: "sizes" }, // Populate sizes trong variants nếu có
    })
    .populate("design", "name image") // Populate thông tin design (nếu cần)
    .sort({ createdAt: -1 });

    return response.json({
      message: "Category product list",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const getProductDetail = async (request, response) => {
  try {
    const {productId} = request.body
    const product = await ProductModel.findOne({_id : productId}).populate({
      path: "variants",
      populate: { path: "sizes" }, // Populate sizes trong variants nếu có
    })
    return response.json({
      message: "product detail",
      success: true,
      error : false,
      data: product,
    });

  } catch (error) {
    
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
}

// productController.js
export const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      category,
      material,
      basePrice,
      description,
      variants,
      design,
      designPlacement,
    } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) {
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }
      updateData.category = category;
    }
    if (material !== undefined) updateData.material = material;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (description !== undefined) updateData.description = description;
    if (design !== undefined) {
      if (design && !mongoose.Types.ObjectId.isValid(design)) {
        return res.status(400).json({ message: "Invalid design ID format" });
      }
      updateData.design = design;
    }
    if (designPlacement !== undefined) updateData.designPlacement = designPlacement;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category design");

    if (variants && Array.isArray(variants)) {
      for (const variantData of variants) {
        if (variantData._id) {
          if (!mongoose.Types.ObjectId.isValid(variantData._id)) {
            return res.status(400).json({ message: "Invalid variant ID format" });
          }
          await VariantModel.findByIdAndUpdate(
            variantData._id,
            {
              $set: {
                color: variantData.color,
                colorCode: variantData.colorCode,
                sizes: variantData.sizes,
              },
            },
            { new: true, runValidators: true }
          );
        } else {
          const newVariant = new VariantModel({
            product: productId,
            color: variantData.color,
            colorCode: variantData.colorCode,
            sizes: variantData.sizes,
          });
          const savedVariant = await newVariant.save();
          updatedProduct.variants.push(savedVariant._id);
        }
      }

      const newVariantIds = variants
        .filter(v => v._id)
        .map(v => v._id.toString());
      const variantsToRemove = product.variants.filter(
        variantId => !newVariantIds.includes(variantId.toString())
      );

      if (variantsToRemove.length > 0) {
        await VariantModel.deleteMany({ _id: { $in: variantsToRemove } });
        updatedProduct.variants = updatedProduct.variants.filter(
          variantId => !variantsToRemove.includes(variantId)
        );
      }

      await updatedProduct.save();
    }

    const finalProduct = await ProductModel.findById(productId)
      .populate("category")
      .populate("variants")
      .populate("design");

    res.status(200).json({
      message: "Product updated successfully",
      data: finalProduct,
      success: true,
      error: false
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
};

export const deleteProduct = async(request, response)=>{
  try {
    const {_id} = request.body

    if (!_id) {
      return response.status(400).json({
        message: "khong co id category",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({_id: _id})
    return response.json({
      message: "San pham da duoc xoa",
      error: false,
      success: true,
      data: deleteProduct,
    });
  
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
}