import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyJwt from "@fastify/jwt";
import fastifyFormbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import qs from "qs";
import { configDotenv } from "dotenv";
configDotenv();

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyFormbody);
app.register(fastifyMultipart, { attachFieldsToBody: true });
// TODO : check if we in jwtService we need to pass the secret ?
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

export default app;
