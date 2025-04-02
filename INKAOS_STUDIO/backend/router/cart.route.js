import {Router} from "express"
import { addProductToCartController, deleteCartItemQtyController, getCartItemController } from "../controllers/cart.controller.js"
import auth from "../middleware/auth.js"

const cartRouter = Router()


cartRouter.post('/add', auth, addProductToCartController)
cartRouter.post('/get',auth, getCartItemController)
cartRouter.delete('/delete-cart-item',auth, deleteCartItemQtyController)
export default cartRouter