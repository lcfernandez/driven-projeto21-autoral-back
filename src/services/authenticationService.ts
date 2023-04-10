import { authenticationRepository } from "../repositories/authenticationRepository.js";

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
  signUp
};
