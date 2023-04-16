import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authenticateToken } from "./middlewares/authValidationMiddleware";
import { authenticationRouter } from "./routers/authenticationRouter";
import { projectsRouter } from "./routers/projectsRouter";
import { imagesRouter } from "./routers/imagesRouter";
import { lanesRouter } from "./routers/lanesRouter";
import { cardsRouter } from "./routers/cardsRouter";

// instance of express
export const app = express();

// configs
app.use(express.json());
app.use(cors());
app.use(authenticationRouter);
app.use(authenticateToken);
app.use(projectsRouter);
app.use(imagesRouter);
app.use(lanesRouter);
app.use(cardsRouter);
dotenv.config();
