import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function verifyJWT(request: any, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.code(401).send({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    request.user = { id: decoded.userId };
  } catch (err) {
    console.log((err as Error)?.message || "An unknown error occurred");

    return reply.code(401).send({ error: "Invalid or expired token" });
  }
}
