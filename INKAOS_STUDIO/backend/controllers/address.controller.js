import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId; 
    const { name, phoneNumber, address, isDefault } = request.body;

    const createAddress = new AddressModel({
      name,
      phoneNumber,
      address,
      isDefault,
      userId: userId,
    });

    const saveAddress = await createAddress.save();

    const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });
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

    const data = await AddressModel.find({ userId: userId });
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
    if (!_id) {
      return response.status(400).json({
        message: "Thiếu ID địa chỉ",
        error: true,
        success: false,
      });
    }
    const updateAddress = await AddressModel.findOneAndUpdate(
      { _id: _id, userId : userId },
      {
        name,
        phoneNumber,
        address,
        isDefault,
      },
      {new: true}
    );
    if (updateAddress.n === 0) {
      return response.status(404).json({
        message: "Không tìm thấy địa chỉ để cập nhật",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Updated address successfully",
      error: false,
      success: true,
      data: updateAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
