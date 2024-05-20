import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { loginSchema } from '../schemas/userSchemas'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { adminInit, auth } from '../components/lib/firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import * as admin from 'firebase-admin'
import { prisma } from '../../prisma/client'

const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  fastify: req.server,
  request: req,
  reply: res,
})

const t = initTRPC.context<typeof createContext>().create()

export const loginRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        loginData: loginSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { loginData } = input
      const { email, password } = loginData

      try {
        adminInit()
        if (!email || !password) {
          throw new Error('Email and password are required')
        }
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        const firebaseToken = await userCredential.user.getIdToken()
        const firebaseUid = (await admin.auth().verifyIdToken(firebaseToken))
          .uid

        const prismaUser = await prisma.user.findUnique({
          where: { firebaseUid },
        })
        if (!prismaUser) {
          throw new Error('User not found')
        }
        const token = ctx.fastify.jwt.sign({ userId: prismaUser.id })
        ctx.reply.setCookie('token', token, {
          httpOnly: false,
          secure: false,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        const userUuid = prismaUser.id
        return userUuid
      } catch (error) {
        console.error(error)
      }
    }),
})
