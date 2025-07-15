import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
HelloController;
export default async function helloRouters(app: FastifyInstance) {
  app.get("/hello", new HelloController().handleMessage);
}