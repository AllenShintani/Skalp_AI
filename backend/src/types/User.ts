export type User = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export type Session = {
  user?: {
    accessToken: string
    id: string
    name: string
    email: string
  }
}
