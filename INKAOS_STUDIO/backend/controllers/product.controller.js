import ProductModel from "../models/product.model.js";

export const addProductController = async (request, response) => {
  try {
    const { name, image, subCategory, stock, price, discount, description } =
      request.body;

    if (
      !name ||
      !image[0] ||
      !subCategory ||
      !stock ||
      !price ||
      !discount ||
      !description
    ) {
      return response.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const newProduct = new ProductModel({
      name,
      image,
      subCategory,
      stock,
      price,
      discount,
      description,
    });

    const saveProduct = await newProduct.save()

    return response.json({
        data: saveProduct,
        success: true,
        error: false,
        message: "Product added successfully"
      });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductController = async(request, response)=>{
    try {
        const data = await ProductModel.find()
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
}
