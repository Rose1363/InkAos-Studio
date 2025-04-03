import UserModel from "../models/user.model.js";
import VariantModel from "../models/variant.model.js";
import ProductModel from "../models/product.model.js";
import DesignModel from "../models/design.model.js";
import ItemModel from "../models/Item.model.js";
import CartModel from "../models/cart.model.js"

export const addProductToCartController = async (request, response) => {
  try {
    const { userId, productId, designId, variantId, size, quantity, price } = request.body;

    if (!userId || !productId || !variantId || !size || !quantity || !price) {
      return response.status(400).json({
        success: false,
        message: "Thiếu thông tin cần thiết để thêm vào giỏ hàng",
        error: true,
      });
    }

    // Lấy thông tin sản phẩm, thiết kế, và biến thể
    const product = await ProductModel.findById(productId);
    const design = designId ? await DesignModel.findById(designId) : null;
    const variant = await VariantModel.findById(variantId);

    if (!product || !variant) {
      return response.status(404).json({
        success: false,
        message: "Sản phẩm hoặc biến thể không tồn tại",
        error: true,
      });
    }

    // Kiểm tra tính hợp lệ của size
    const sizeData = variant.sizes.find((s) => s.name === size);
    if (!sizeData) {
      return response.status(400).json({
        success: false,
        message: `Kích thước ${size} không tồn tại trong biến thể`,
        error: true,
      });
    }

    // Kiểm tra số lượng tồn kho
    if (sizeData.stock < quantity) {
      return response.status(400).json({
        success: false,
        message: `Số lượng tồn kho không đủ (còn ${sizeData.stock} sản phẩm)`,
        error: true,
      });
    }

    // Tạo một bản ghi Item mới
    const item = new ItemModel({
      productId,
      productName: product.name,
      productImage: product.image && product.image.length > 0 ? product.image[0] : null,
      productBasePrice: product.basePrice,
      category: product.category, // Lưu danh mục của sản phẩm
      designId: designId || null,
      designName: design ? design.name : null,
      designImage: design ? design.thumbnail : null,
      designBasePrice: design ? design.basePrice : 0,
      variantId,
      colorCode: variant.colorCode,
      color: variant.color,
      size,
      variantPrice: sizeData.price,
      totalPrice: price,
      createdBy: userId,
      isPublic: design ? design.isPublic : false, // Item công khai nếu thiết kế công khai
    });

    await item.save();

    // Thêm Item vào giỏ hàng
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === item._id.toString()
    );

    if (existingItemIndex !== -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (sizeData.stock < newQuantity) {
        await ItemModel.deleteOne({ _id: item._id });
        return response.status(400).json({
          success: false,
          message: `Số lượng tồn kho không đủ (còn ${sizeData.stock} sản phẩm)`,
          error: true,
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        itemId: item._id,
        quantity,
      });
    }

    await cart.save();

    return response.json({
      success: true,
      message: "Đã thêm sản phẩm vào giỏ hàng!",
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
  
      // Tìm giỏ hàng của người dùng và populate itemId
      let cart = await CartModel.findOne({ userId }).populate({
        path: "items.itemId",
        populate: [
          { path: "productId" },
          { path: "designId" },
          { path: "variantId" },
        ],
      });
  
      // Nếu không có giỏ hàng, tạo mới một giỏ hàng rỗng
      if (!cart) {
        cart = new CartModel({ userId, items: [] });
        await cart.save();
        // Cập nhật trường cart trong UserModel
        await UserModel.updateOne(
          { _id: userId },
          {
            $set: {
              cart: cart._id,
            },
          }
        );
      }
  
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

  export const updateCartItemQtyController = async (request, response) => {
    try {
      const userId = request.userId;
      const { _id, qty } = request.body;
  
      // Kiểm tra dữ liệu đầu vào
      if (!userId) {
        return response.status(401).json({
          message: "Không tìm thấy userId. Vui lòng đăng nhập lại.",
          error: true,
          success: false,
        });
      }
      if (!_id || !qty || qty < 1) {
        return response.status(400).json({
          message: "Thiếu _id hoặc qty không hợp lệ",
          error: true,
          success: false,
        });
      }
  
      // Tìm giỏ hàng của người dùng
      const cart = await CartModel.findOne({ userId, "items.itemId": _id });
      if (!cart) {
        return response.status(404).json({
          message: "Không tìm thấy giỏ hàng hoặc mục hàng",
          error: true,
          success: false,
        });
      }
  
      // Tìm chỉ số của mục trong mảng items
      const itemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === _id
      );
      if (itemIndex === -1) {
        return response.status(404).json({
          message: "Mục không tồn tại trong giỏ hàng",
          error: true,
          success: false,
        });
      }
  
      // Populate thông tin Item để kiểm tra tồn kho
      const item = await ItemModel.findById(_id).populate("variantId");
      if (!item) {
        return response.status(404).json({
          message: "Không tìm thấy mục hàng",
          error: true,
          success: false,
        });
      }
  
      const sizeData = item.variantId.sizes.find((s) => s.name === item.size);
      if (!sizeData) {
        return response.status(400).json({
          message: "Kích thước không hợp lệ",
          error: true,
          success: false,
        });
      }
  
      if (sizeData.stock < qty) {
        return response.status(400).json({
          message: `Số lượng tồn kho không đủ (còn ${sizeData.stock} sản phẩm)`,
          error: true,
          success: false,
        });
      }
  
      // Cập nhật số lượng trong mảng items
      cart.items[itemIndex].quantity = qty;
      await cart.save();
  
      return response.json({
        message: "Đã cập nhật số lượng",
        success: true,
        error: false,
        data: cart.items,
      });
    } catch (error) {
      console.error("Update Cart Item Quantity Error:", error); // Log lỗi để debug
      return response.status(500).json({
        message: error.message || "Có lỗi xảy ra",
        error: true,
        success: false,
      });
    }
  };

export const deleteCartItemQtyController = async (request, response) => {
    try {
      const userId = request.userId;
      const { itemId } = request.body; // Đổi tên từ _id thành itemId để rõ ràng hơn
  
      if (!userId) {
        return response.status(400).json({
          message: "Thiếu userId",
          error: true,
          success: false,
        });
      }
  
      if (!itemId) {
        return response.status(400).json({
          message: "Thiếu itemId",
          error: true,
          success: false,
        });
      }
  
      // Tìm giỏ hàng của người dùng
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        return response.status(404).json({
          message: "Giỏ hàng không tồn tại",
          error: true,
          success: false,
        });
      }
  
      // Kiểm tra xem itemId có tồn tại trong giỏ hàng không
      const itemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === itemId
      );
      if (itemIndex === -1) {
        return response.status(404).json({
          message: "Mục không tồn tại trong giỏ hàng",
          error: true,
          success: false,
        });
      }
  
      // Xóa mục khỏi giỏ hàng
      cart.items.splice(itemIndex, 1);
  
      // Lưu giỏ hàng
      await cart.save();
  
      // Xóa bản ghi Item trong ItemModel (nếu không còn được sử dụng)
      const remainingItems = await CartModel.find({
        "items.itemId": itemId,
      });
      if (remainingItems.length === 0) {
        await ItemModel.deleteOne({ _id: itemId });
      }
  
      return response.json({
        message: "Đã xóa mục khỏi giỏ hàng",
        error: false,
        success: true,
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

  export const deleteItemController = async (request, response) => {
    try {
      const userId = request.userId;
      const { cartItemId } = request.body; // Đổi tên thành cartItemId để rõ ràng
  
      if (!userId) {
        return response.status(400).json({ message: "Thiếu userId", error: true, success: false });
      }
      if (!cartItemId) {
        return response.status(400).json({ message: "Thiếu cartItemId", error: true, success: false });
      }
  
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        return response.status(404).json({ message: "Giỏ hàng không tồn tại", error: true, success: false });
      }
  
      const itemIndex = cart.items.findIndex((item) => item._id.toString() === cartItemId);
      if (itemIndex === -1) {
        return response.status(404).json({ message: "Mục không tồn tại trong giỏ hàng", error: true, success: false });
      }
  
      const itemId = cart.items[itemIndex].itemId; // Lấy itemId để xóa trong ItemModel nếu cần
      cart.items.splice(itemIndex, 1);
      await cart.save();
  
      const remainingItems = await CartModel.find({ "items.itemId": itemId });
      if (remainingItems.length === 0) {
        await ItemModel.deleteOne({ _id: itemId });
      }
  
      return response.json({ message: "Đã xóa mục khỏi giỏ hàng", error: false, success: true, data: cart.items });
    } catch (error) {
      return response.status(500).json({ message: error.message || "Có lỗi xảy ra", error: true, success: false });
    }
  };