import { response } from "express";
import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request, response) => {
  try {
    const { name, category } = request.body;

    if (!name || !category) {
      return response.status(400).json({
        message: "Provide name, category",
        error: true,
        success: false,
      });
    }

    const newSubCategory = new SubCategoryModel({
      name,
      category,
    });

    const saveSubCategory = await newSubCategory.save();

    return response.json({
      message: "SubCategory created successfully",
      error: false,
      success: true,
      data: saveSubCategory,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getSubCategoryController = async (request, response) => {
  try {
    const data = await SubCategoryModel.find().populate('category');

    return response.json({
        message: "Sub Category data",
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
