import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { loginSchema } from "../schemas/userSchemas";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { adminInit, auth } from "../components/lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as admin from "firebase-admin";
import { prisma } from "../../prisma/client";
import { TRPCError } from "@trpc/server";

const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  fastify: req.server,
  request: req,
  reply: res,
});

const t = initTRPC.context<typeof createContext>().create();

export const loginRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        loginData: loginSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { loginData } = input;
      const { email, password } = loginData;

      try {
        adminInit();
        if (!email || !password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email and password are required",
          });
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          if (error.code === "auth/invalid-credential") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid email or password",
            });
          }
          if (error.code === "auth/too-many-requests") {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message:
                "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          });
        });

        const firebaseToken = await userCredential.user.getIdToken();
        const firebaseUid = (await admin.auth().verifyIdToken(firebaseToken))
          .uid;

        const prismaUser = await prisma.user.findUnique({
          where: { firebaseUid },
        });
        if (!prismaUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        }
        const token = ctx.fastify.jwt.sign({ userId: prismaUser.id });
        ctx.reply.setCookie("token", token, {
          httpOnly: false,
          secure: false, // 本番環境ではtrueにする
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        const userUuid = prismaUser.id;
        return userUuid;
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
