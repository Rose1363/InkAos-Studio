import CartModel from "../models/cart.model";
import UserModel from '../models/user.model'

export const addProductToCartController = async(request, repsonse)=>{
    try {
        const userId = request.body
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
}