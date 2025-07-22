import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";

export default function helloRouters(app: FastifyInstance) {
  app.get("/hello", new HelloController().handleMessage);
}
