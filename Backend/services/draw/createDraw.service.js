import { PrismaClient } from "@prisma/client";

export default async function ({ name, kind, size, coordinates, userId }) {
  const prisma = new PrismaClient();
  const transformedCoordinates = [];
  for (let i = 0; i < coordinates.length; i += 2) {
    transformedCoordinates.push([coordinates[i], coordinates[i + 1]]);
  }
  coordinates = JSON.stringify(transformedCoordinates);
  const draw = await prisma.draw.create({
    data: {
      name,
      kind,
      size,
      coordinates,
      userId,
    },
  });
  return draw;
}
