import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { name, phoneNumber, address, isDefault } = request.body;

    // Tạo địa chỉ mới
    const createAddress = new AddressModel({
      name,
      phoneNumber,
      address,
      isDefault: isDefault || false, // Đảm bảo isDefault không undefined
      userId: userId,
    });

    // Lưu địa chỉ mới
    const saveAddress = await createAddress.save();

    // Cập nhật UserModel để thêm _id của địa chỉ mới
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    // Nếu địa chỉ mới được chọn là mặc định, đặt các địa chỉ khác thành không mặc định
    if (isDefault) {
      await AddressModel.updateMany(
        { userId, _id: { $ne: saveAddress._id }, isDefault: true }, // Loại trừ địa chỉ vừa tạo
        { $set: { isDefault: false } }
      );
    }

    return response.json({
      message: "Address created successfully",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
export const getAddressController = async (request, response) => {
  try {
    const userId = request.userId;

    const data = await AddressModel.find({ userId: userId }).sort({
      isDefault: -1,
    });
    return response.json({
      message: "List of address",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, name, phoneNumber, address, isDefault } = request.body;

    // Kiểm tra nếu thiếu _id
    if (!_id) {
      return response.status(400).json({
        message: "Thiếu ID địa chỉ",
        error: true,
        success: false,
      });
    }

    // Kiểm tra xem địa chỉ có tồn tại và thuộc về user không
    const existingAddress = await AddressModel.findOne({ _id, userId });
    if (!existingAddress) {
      return response.status(404).json({
        message: "Không tìm thấy địa chỉ hoặc bạn không có quyền chỉnh sửa",
        error: true,
        success: false,
      });
    }

    // Cập nhật địa chỉ
    const updateAddress = await AddressModel.findOneAndUpdate(
      { _id, userId },
      {
        name,
        phoneNumber,
        address,
        isDefault: isDefault || false,
      },
      { new: true, runValidators: true }
    );

    if (isDefault) {
      await AddressModel.updateMany(
        { userId, _id: { $ne: _id }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    return response.json({
      message: "Cập nhật địa chỉ thành công",
      error: false,
      success: true,
      data: updateAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
};

export const deleteAddresscontroller = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Thiếu ID địa chỉ",
        error: true,
        success: false,
      });
    }

    const deletedAddress = await AddressModel.findOneAndDelete({
      _id: _id,
      userId,
    });

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { address_details: _id },
    });

    return response.json({
      message: "Địa chỉ đã được xóa",
      error: false,
      success: true,
      data: deletedAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Lỗi máy chủ nội bộ",
      error: true,
      success: false,
    });
  }
};
