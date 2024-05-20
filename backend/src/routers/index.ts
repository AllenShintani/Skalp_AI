import { initTRPC } from '@trpc/server'
import { signupRouter } from './signup'
import { loginRouter } from './login'

const t = initTRPC.create()

export const appRouter = t.mergeRouters(signupRouter, loginRouter)
export type AppRouter = typeof appRouter
