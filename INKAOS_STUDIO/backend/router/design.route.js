import express from "express";
import {
  addDesign,
  getDesign,
  getDesignByStyle,
  getDesignDetail,
  getPublicDesigns,
  updateDesign,
} from "../controllers/design.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";

const designRouter = express.Router();

designRouter.post("/add", auth, addDesign); // Thêm mới hoặc cập nhật
designRouter.post("/get", auth, getDesign);
designRouter.post("/get-design-by-style", getDesignByStyle);
designRouter.post("/get-public-design", getPublicDesigns);
designRouter.post("/get-design-detail", getDesignDetail);
designRouter.put("/update", updateDesign);
export default designRouter;
