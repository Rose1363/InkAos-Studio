import { Router } from "express";
import auth from "../middleware/auth.js";
import { saveTextDesign } from "../controllers/textDesign.controller.js";

const textDesignRouter = Router()

textDesignRouter.post('/add', auth, saveTextDesign)

export default textDesignRouter