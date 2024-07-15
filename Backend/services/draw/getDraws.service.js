import { PrismaClient } from "@prisma/client";

export default async function ({ userId }) {
  const prisma = new PrismaClient();
  let draws;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role !== "admin") {
    draws = await prisma.draw.findMany({
      where: {
        userId,
      },
    });
  }
  if (user.role === "admin") {
    draws = await prisma.draw.findMany();
  }
  return draws;
}
