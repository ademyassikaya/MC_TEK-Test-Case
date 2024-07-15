import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Ortam değişkenlerini yükler

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error("Environment variables for token secrets are not set.");
}

export function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: "15m" });
}

export function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshTokenSecret);
}