import { initTRPC } from '@trpc/server'
import { userSchema } from '../schemas/userSchemas'
import { z } from 'zod'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { TRPCError } from '@trpc/server'
import { adminInit, auth } from '../components/lib/firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { prisma } from '../../prisma/client'
import * as admin from 'firebase-admin'

const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  fastify: req.server,
  request: req,
  reply: res,
})

const t = initTRPC.context<typeof createContext>().create()

export const signupRouter = t.router({
  signup: t.procedure
    .input(
      z.object({
        userData: userSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userData } = input
      const { email, password, firstName, lastName } = userData
      const fullName =
        firstName && lastName ? `${lastName} ${firstName}` : undefined

      try {
        adminInit()

        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const firebaseToken = await userCredential.user.getIdToken()
        const firebaseUid = (await admin.auth().verifyIdToken(firebaseToken))
          .uid

        const prismaUser = await prisma.user.create({
          data: {
            email,
            firebaseUid: firebaseUid,
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
          },
        })
        const token = ctx.fastify.jwt.sign({ userId: prismaUser.id })
        ctx.reply.setCookie('token', token, {
          httpOnly:
            false /*console.logでフロントエンドに表示したりするためにfalseにしている*/,
          secure: false /*process.env.NODE_ENV !== 'production'*/, //本番環境ではtrueにしなきゃいけない！要確認！！
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7日間有効
        })

        const userUuid = prismaUser.id
        return { userUuid }
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
        })
      }
    }),
})
