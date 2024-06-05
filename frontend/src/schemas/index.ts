import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
