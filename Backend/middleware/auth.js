import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function authMiddleware(req, res, next) {
  let accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access token or refresh token is required" });
  }

  try {
    if (accessToken) {
      const decodedAccessToken = verifyAccessToken(accessToken);
      const user = await prisma.user.findUnique({
        where: {
          id: decodedAccessToken.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.userId = user.id;
      return next();
    }

    if (refreshToken) {
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({
        where: {
          id: decodedRefreshToken.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newAccessToken = generateAccessToken(user.id);
      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      req.userId = user.id;
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
