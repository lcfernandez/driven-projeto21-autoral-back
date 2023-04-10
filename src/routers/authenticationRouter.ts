import { Router } from "express";
import { signUp } from "../controllers/authenticationController.js";
import { signUpSchemaValidation } from "../middlewares/authValidationMiddleware.js";

export const authenticationRouter = Router();

authenticationRouter.post("/sign-up", signUpSchemaValidation, signUp);
