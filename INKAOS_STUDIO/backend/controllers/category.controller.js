import CategoryModel from "../models/category.model.js";

export const AddCategoryController = async (request, response) => {
  try {
    const { name, image } = request.body;

    if (!name || !image) {
      return response.status(400).json({
        message: "Provide name, image",
        error: true,
        success: false,
      });
    }

    const newCategory = new CategoryModel({
      name,
      image,
    });

    const saveCategory = await newCategory.save();

    if (!saveCategory) {
      return response.status(500).json({
        message: "Category created fail",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Category created successfully",
      error: false,
      success: true,
      data: saveCategory,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getCategoryController = async (request, response) => {
  try {
    const data = await CategoryModel.find();

    return response.json({
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
