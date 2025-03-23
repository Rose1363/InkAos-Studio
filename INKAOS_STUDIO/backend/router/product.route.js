import {Router} from 'express'
import auth from "../middleware/auth.js";
import { addProductController } from '../controllers/product.controller.js';

const productRouter = Router()

productRouter.post('/create',auth, addProductController)
// productRouter.get('/get', auth, getAddressController)
// productRouter.put('/update', auth, updateAddressController)
export default productRouter