import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
configDotenv();
const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function getTheUserIdFromToken(
  token: string | undefined | null
): string | null {
  try {
    if (!token || typeof token !== "string") {
      console.error("Token is not a valid string:", token);
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
