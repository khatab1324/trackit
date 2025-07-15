import { FastifyRequest, FastifyReply } from "fastify";

export default class HelloController {
  constructor() {}
  handleMessage = (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: "Hello from Fastify Clean Architecture! 🧼" });
  };
}
