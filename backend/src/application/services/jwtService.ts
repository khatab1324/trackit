import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
