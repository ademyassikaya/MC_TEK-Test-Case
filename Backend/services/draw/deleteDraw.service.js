import { PrismaClient } from "@prisma/client";

export default async function ({ id }) {
  const prisma = new PrismaClient();
  const draw = await prisma.draw.delete({
    where: {
      id,
    },
  });
  return draw;
}
