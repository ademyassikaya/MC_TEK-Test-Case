import { PrismaClient } from "@prisma/client";

export default async function ({ id, name }) {
  const prisma = new PrismaClient();
  const draw = await prisma.draw.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return draw;
}
