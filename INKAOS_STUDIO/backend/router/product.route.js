import {Router} from 'express'
import auth from "../middleware/auth.js";
import { addProductController, getProductByCategory, getProductController } from '../controllers/product.controller.js';

const productRouter = Router()

productRouter.post('/create',auth, addProductController)
productRouter.post('/get', getProductController)
productRouter.post('/get-product-by-category', getProductByCategory)
// productRouter.put('/update', auth, updateProductController)
export default productRouter