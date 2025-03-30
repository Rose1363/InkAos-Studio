import express from 'express';
import { addDesign, getDesign } from '../controllers/design.controller.js';
import auth from '../middleware/auth.js';


const designRouter = express.Router();

designRouter.post('/add', auth, addDesign); // Thêm mới hoặc cập nhật
designRouter.post('/get', auth,getDesign)
export default designRouter;
