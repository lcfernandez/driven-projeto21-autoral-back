import { Request, Response } from "express";
import { authenticationService } from "../services/authenticationService.js";

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await authenticationService.signIn(email, password);

    res.status(200).send(result);
  } catch (err) {
    res.sendStatus(401);
  }
}

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
