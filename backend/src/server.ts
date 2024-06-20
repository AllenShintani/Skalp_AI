import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { appRouter } from "./routers";
import { prisma } from "../prisma/client";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import verifyToken from "./middlewares/verifyToken";
import dotenv from "dotenv";

const server: FastifyInstance = Fastify();

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

server.register(fastifyCookie);

// tRPCプラグインを登録
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext: ({ req, res }: CreateFastifyContextOptions) => ({
      fastify: server,
      request: req,
      reply: res,
    }),
  },
});

// CORS設定
server.register(cors, {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

// ミドルウェアの適用
server.addHook("preHandler", verifyToken);

// サーバーを起動
const start = async () => {
  try {
    await prisma.$connect();
    await server.listen({ port: 8080 });
    console.log(`Server listening on port: http://localhost:8080`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
