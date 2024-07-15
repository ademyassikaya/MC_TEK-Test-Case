import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function createUser({ name, surname, email, password,role }) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: await bcrypt.hash(password, 10),
        role: role || "user",
      },
    });
    delete newUser.password;
    return newUser;
  }

  delete user.password;
  return user;
}
