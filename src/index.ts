import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// instance of express
const app = express();

// configs
app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
