import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth.js";

export default async function login({ email, password, userId }) {
  const prisma = new PrismaClient();

  const user = userId
    ? await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
    : await prisma.user.findUnique({
        where: {
          email,
        },
      });

  if (!user) {
    throw new Error("User not found");
  }

  if (userId) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
}
