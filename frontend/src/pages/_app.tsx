import { AppProps } from 'next/app'
import '../styles/globals.css'
import { getCookie, deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getCookie('token')

    const handleRouteChange = async () => {
      if (!token) {
        if (router.pathname !== '/signup' && router.pathname !== '/login') {
          await router.push('/login')
        }
        setLoading(false)
        return
      }

      if (token) {
        try {
          // トークンをデコードして有効かどうかを確認
          JSON.parse(atob(token.split('.')[1]))
          if (router.pathname === '/login' || router.pathname === '/signup') {
            await router.push(`/workspace`)
          }
        } catch (error) {
          // 無効なトークンの場合はクッキーを削除し、loginページへリダイレクト
          deleteCookie('token')
          await router.push('/login')
        }
      }
      setLoading(false)
    }

    handleRouteChange()
  }, [router.pathname])

  if (loading) {
    return <div>Loading...</div>
  }

  return <Component {...pageProps} />
}

export default MyApp
