import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authenticationRouter } from "./routers/authenticationRouter.js";

// instance of express
const app = express();

// configs
app.use(express.json());
app.use(cors());
app.use(authenticationRouter);
dotenv.config();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
