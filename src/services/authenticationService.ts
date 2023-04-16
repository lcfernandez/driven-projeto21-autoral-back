import { invalidCredentialsError } from "../errors";
import { authenticationRepository } from "../repositories/authenticationRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signIn(email: string, password: string) {
  const user = await authenticationRepository.findByEmail(email.toLowerCase());

  if (!user) throw invalidCredentialsError();

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw invalidCredentialsError();

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  await authenticationRepository.insertToken(user.id, token);

  return token;
}

async function signUp(name: string, email: string, password: string) {
  const emailExists = await authenticationRepository.findByEmail(email.toLowerCase());

  if (emailExists) {
    throw {
      name: "DuplicatedEmailError",
      message: "There is already an user with given email",
    };
  }

  authenticationRepository.insertUser(name.trim(), email.toLowerCase(), password);
}

export const authenticationService = {
  signIn,
  signUp
};
