import { Router } from "express";
import { create, remove } from "../controllers/imagesController.js";
import { imagesSchemaValidation } from "../middlewares/imagesValidationMiddleware.js";

export const imagesRouter = Router();

imagesRouter.delete("/images/:id", remove);
imagesRouter.post("/images", imagesSchemaValidation, create);
