import type { NextApiRequest, NextApiResponse } from 'next'

type TestRes = {
  title: string
  content: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<TestRes>) => {
  const result: TestRes = {
    title: `id: ${req.query.id}, authorization header: ${req.headers.authorization}`,
    content: `body[test]: ${req.body['test']}, cookie[test]: ${req.cookies.test}`,
  }
  res.status(200).send(result)
}

export default handler
