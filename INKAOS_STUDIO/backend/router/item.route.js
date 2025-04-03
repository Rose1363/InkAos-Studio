import express from "express";
import { getPublicItemsController } from "../controllers/item.controller.js";

const itemRouter = express.Router();

itemRouter.get("/public-items", getPublicItemsController);

export default itemRouter;