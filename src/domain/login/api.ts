import axios from 'axios'

const backendUrl = 'http://localhost:8080'

export const login = async (email: string, password: string) => {
  const result = await axios.post(`${backendUrl}/data`, {
    email,
    password,
  })
  return result
}
