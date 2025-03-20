import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddCategoryController, getCategoryController } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post('/add',auth, AddCategoryController)
categoryRouter.get('/get', auth, getCategoryController)
// addressRouter.put('/update', auth, updateAddressController)
export default categoryRouter