import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
})

export const createUserSchema = z.object({
  token: z.string(),
  userData: z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
