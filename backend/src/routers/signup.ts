import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { userSchema } from "../schemas/userSchemas";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { adminInit, auth } from "../components/lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { prisma } from "../../prisma/client";
import { TRPCError } from "@trpc/server";
import * as admin from "firebase-admin";

const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  fastify: req.server,
  request: req,
  reply: res,
});

const t = initTRPC.context<typeof createContext>().create();

export const signupRouter = t.router({
  signup: t.procedure
    .input(
      z.object({
        userData: userSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userData } = input;
      const { email, password, firstName, lastName } = userData;

      try {
        adminInit();
        if (!email || !password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email and password are required",
          });
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "このメールアドレスは既に使用されています",
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

        const prismaUser = await prisma.user.create({
          data: {
            email,
            firebaseUid,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
          },
        });

        const token = ctx.fastify.jwt.sign({ userId: prismaUser.id });
        ctx.reply.setCookie("token", token, {
          httpOnly: false,
          secure: false, // 本番環境ではtrueにする
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return { userUuid: prismaUser.id };
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
