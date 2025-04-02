import UserModel from "../models/user.model.js";
import VariantModel from "../models/variant.model.js";
import ProductModel from "../models/product.model.js";
import DesignModel from "../models/design.model.js";
import CartModel from "../models/cart.model.js";
export const addProductToCartController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, designId, variantId, size, quantity, price } =
      request.body;

    // Kiểm tra các trường bắt buộc
    if (!productId || !designId || !variantId || !size || !quantity || !price) {
      return response.status(400).json({
        success: false,
        message: "Thiếu thông tin cần thiết",
        error: true,
      });
    }

    // Kiểm tra userId có tồn tại không
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
        error: true,
      });
    }

    // Kiểm tra productId có tồn tại không
    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
        error: true,
      });
    }

    // Kiểm tra variantId có tồn tại và hợp lệ không
    const variant = await VariantModel.findById(variantId);
    if (!variant) {
      return response.status(404).json({
        success: false,
        message: "Biến thể không tồn tại",
        error: true,
      });
    }

    // Kiểm tra xem variant có thuộc sản phẩm không
    if (variant.product.toString() !== productId) {
      return response.status(400).json({
        success: false,
        message: "Biến thể không thuộc sản phẩm này",
        error: true,
      });
    }

    // Kiểm tra kích thước có trong variant không
    const sizeInfo = variant.sizes.find((s) => s.name === size);
    if (!sizeInfo) {
      return response.status(400).json({
        success: false,
        message: "Kích thước không hợp lệ",
        error: true,
      });
    }

    // Kiểm tra tồn kho
    if (sizeInfo.stock < quantity) {
      return response.status(400).json({
        success: false,
        message: `Số lượng vượt quá tồn kho (chỉ còn ${sizeInfo.stock} sản phẩm)`,
        error: true,
      });
    }

    // Kiểm tra designId (nếu có)
    if (designId) {
      const design = await DesignModel.findById(designId);
      if (!design) {
        return response.status(404).json({
          success: false,
          message: "Thiết kế không tồn tại",
          error: true,
        });
      }
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (item.designId?.toString() === designId ||
          (!item.designId && !designId)) &&
        item.variantId.toString() === variantId &&
        item.size === size
    );

    if (existingItemIndex !== -1) {
      // Nếu đã có, tăng số lượng
      cart.items[existingItemIndex].quantity += quantity;
      // Kiểm tra lại tồn kho
      if (cart.items[existingItemIndex].quantity > sizeInfo.stock) {
        return response.status(400).json({
          success: false,
          message: `Số lượng vượt quá tồn kho (chỉ còn ${sizeInfo.stock} sản phẩm)`,
          error: true,
        });
      }
    } else {
      // Nếu chưa có, thêm mới
      cart.items.push({
        productId,
        designId,
        variantId,
        size,
        quantity,
        price,
      });
    }

    // Lưu giỏ hàng
    await cart.save();
    await cart.populate("items.productId items.designId items.variantId");

    // Cập nhật trường cart trong UserModel
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          cart: cart._id, // Lưu _id của giỏ hàng vào trường cart của người dùng
        },
      }
    );

    return response.json({
      message: "Đã thêm sản phẩm vào giỏ hàng",
      success: true,
      error: false,
      data: cart.items,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Có lỗi xảy ra",
      error: true,
      success: false,
    });
  }
};


export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    // Kiểm tra userId
    if (!userId) {
      return response.status(400).json({
        success: false,
        message: "Thiếu userId",
        error: true,
      });
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
        error: true,
      });
    }

    // Tìm giỏ hàng của người dùng
    let cart = await CartModel.findOne({ userId })
      .populate("items.productId")
      .populate("items.designId")
      .populate("items.variantId");

    // Nếu không có giỏ hàng, tạo mới một giỏ hàng rỗng
    // if (!cart) {
    //   cart = new CartModel({ userId, items: [] });
    //   await cart.save();
    //   // Cập nhật trường cart trong UserModel
    //   await UserModel.updateOne(
    //     { _id: userId },
    //     {
    //       $set: {
    //         cart: cart._id,
    //       },
    //     }
    //   );
    // }

    return response.json({
      success: true,
      error: false,
      data: cart.items, // Trả về danh sách items (một mảng)
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Có lỗi xảy ra",
      error: true,
      success: false,
    });
  }
};


export const deleteCartItemQtyController = async(request, response)=>{
    try {
        const userId = request.userId;

        const { _id} = request.body

        if(!_id){
            return response.status(400).json({
                message: "Thieu _Id item",
                error: true,
                success: false,
              });
        }

        const deleteCartItem = await CartModel.deleteOne({_id: _id, userId: userId})

        return response.json({
            message: "Da xoa Item",
                error: false,
                success: true,
                data: deleteCartItem
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Có lỗi xảy ra",
            error: true,
            success: false,
          });
    }
}