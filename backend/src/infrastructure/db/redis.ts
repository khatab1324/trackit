import Redis from "ioredis";
import { configDotenv } from "dotenv";

configDotenv();

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});
