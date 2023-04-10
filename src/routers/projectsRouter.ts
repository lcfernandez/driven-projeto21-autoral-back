import { Router } from "express";
import { create, update } from "../controllers/projectsController.js";
import { projectsSchemaValidation } from "../middlewares/projectsValidationMiddleware.js";

export const projectsRouter = Router();

projectsRouter.post("/projects", projectsSchemaValidation, create);
projectsRouter.put("/projects/:id", projectsSchemaValidation, update);
