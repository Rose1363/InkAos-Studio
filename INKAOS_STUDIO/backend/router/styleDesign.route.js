import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddStyleDesignController, getStyleDesignController } from "../controllers/styleDesign.controller.js";

const styleDesignRouter = Router()

styleDesignRouter.post('/add',auth, AddStyleDesignController)
styleDesignRouter.get('/get', getStyleDesignController)
// addressRouter.put('/update', auth, updateAddressController)
export default styleDesignRouter