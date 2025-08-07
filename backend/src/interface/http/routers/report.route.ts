import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { memoryReportController } from "../controllers/memoryReportController";

export default async function reportRouter(app: FastifyInstance) {
  app.post("/memoryReport", { preHandler: [verifyJWT] }, memoryReportController);
}