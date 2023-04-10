import { Request, Response } from "express";
import { authenticationService } from "../services/authenticationService.js";

export async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    await authenticationService.signUp(name, email, password);

    res.sendStatus(201);
  } catch (err) {
    if (err.name === "DuplicatedEmailError") {
      return res.status(409).send(err.message);
    }
    
    res.sendStatus(400);
  }
}
