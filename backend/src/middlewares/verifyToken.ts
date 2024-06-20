import { FastifyReply, FastifyRequest } from "fastify";
import { verify, JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req: FastifyRequest, reply: FastifyReply, next: any) => {
  const token = req.cookies.token;

  // サインアップとログインのルートをスキップ
  if (req.url.includes("/trpc/signup") || req.url.includes("/trpc/login")) {
    next();
    return;
  }

  if (!token) {
    reply.code(401).send({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      reply.clearCookie("token");
      reply.code(401).send({ error: "Unauthorized" });
    } else {
      // その他のエラーが発生した場合は500エラーを返す
      reply.code(500).send({ error: "Internal Server Error" });
    }
  }
};

export default verifyToken;
