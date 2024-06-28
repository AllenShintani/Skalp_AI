import '../styles/globals.css'
import type { AppProps } from 'next/app'
import useAuthCheck from '../hooks/useAuthCheck'

function MyApp({ Component, pageProps }: AppProps) {
  const { loading } = useAuthCheck()

  if (loading) {
    return <div>Loading...</div>
  }

  return <Component {...pageProps} />
}

export default MyApp
