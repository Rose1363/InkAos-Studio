import { response } from "express";
import StyleDesignModel from "../models/styleDesign.model.js";

export const AddStyleDesignController = async (request, response) => {
  try {
    const { name, image } = request.body;

    if (!name || !image) {
      return response.status(400).json({
        message: "Provide name, image",
        error: true,
        success: false,
      });
    }

    const newStyle = new StyleDesignModel({
      name,
      image,
    });

    const saveStyle = await newStyle.save();

    if (!saveStyle) {
      return response.status(500).json({
        message: "Style created fail",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Style created successfully",
      error: false,
      success: true,
      data: saveStyle,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getStyleDesignController = async (request, response) => {
  try {
    const data = await StyleDesignModel.find();

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
