import { Router } from "express";
import { create , remove, update } from "../controllers/cardsController.js";
import { cardsSchemaValidation } from "../middlewares/cardsValidationMiddleware.js";

export const cardsRouter = Router();

cardsRouter.delete("/cards/:id", remove);
cardsRouter.post("/cards", cardsSchemaValidation, create);
cardsRouter.put("/cards/:id", cardsSchemaValidation, update);
