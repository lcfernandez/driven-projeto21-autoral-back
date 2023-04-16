import { prisma } from "../configs/database";
import bcrypt from "bcrypt";

async function findByEmail(email: string) {
  return await prisma.users.findUnique({where: { email } });
}

async function insertToken(userId: number, token: string) {
  await prisma.users.update({ where: { id: userId }, data: { token } });
}

async function insertUser(name: string, email: string, password: string) {
  const cryptedPassword: string = bcrypt.hashSync(password, 12);

  await prisma.users.create({
    data: {
      name,
      email,
      password: cryptedPassword,
      token: ""
    }
  });
}

export const authenticationRepository = {
  findByEmail,
  insertToken,
  insertUser
};
