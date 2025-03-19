import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { uploadImageController } from "../controllers/image.controller.js";

const imageRouter = Router()

imageRouter.post("/upload", auth,upload.single("image"), uploadImageController)

export default imageRouter