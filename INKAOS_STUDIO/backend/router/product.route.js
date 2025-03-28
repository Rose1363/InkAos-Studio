import {Router} from 'express'
import auth from "../middleware/auth.js";
import { addProductController, getProductController } from '../controllers/product.controller.js';

const productRouter = Router()

productRouter.post('/create',auth, addProductController)
productRouter.get('/get', auth, getProductController)
// productRouter.put('/update', auth, updateProductController)
export default productRouter