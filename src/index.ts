import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authenticateToken } from "./middlewares/authValidationMiddleware.js";
import { authenticationRouter } from "./routers/authenticationRouter.js";
import { projectsRouter } from "./routers/projectsRouter.js";
import { imagesRouter } from "./routers/imagesRouter.js";
import { lanesRouter } from "./routers/lanesRouter.js";
import { cardsRouter } from "./routers/cardsRouter.js";

// instance of express
const app = express();

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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
