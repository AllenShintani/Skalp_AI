import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const checkAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    return res.status(401).json({ isAuthenticated: false })
  }

  try {
    verify(token, secret)
    return res.status(200).json({ isAuthenticated: true })
  } catch (error) {
    return res.status(401).json({ isAuthenticated: false })
  }
}

export default checkAuth
