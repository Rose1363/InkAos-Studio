import {Router} from 'express'
import auth from "../middleware/auth.js";
import { addProductController, deleteProduct, getProductByCategory, getProductController, getProductDetail, updateProduct } from '../controllers/product.controller.js';
import { admin } from '../middleware/Admin.js';

const productRouter = Router()

productRouter.post('/create',auth,admin, addProductController)
productRouter.post('/get', getProductController)
productRouter.post('/get-product-by-category', getProductByCategory)
productRouter.post('/get-product-detail', getProductDetail)
productRouter.put('/update',auth,admin,updateProduct)
productRouter.delete('/delete',auth,admin,deleteProduct)

export default productRouter