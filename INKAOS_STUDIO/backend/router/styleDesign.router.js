import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddStyleDesignController, getStyleDesignController } from "../controllers/styleDesign.controller.js";

const StyleDesignRouter = Router()

StyleDesignRouter.post('/add',auth, AddStyleDesignController)
StyleDesignRouter.get('/get', getStyleDesignController)
// addressRouter.put('/update', auth, updateAddressController)
export default StyleDesignRouter