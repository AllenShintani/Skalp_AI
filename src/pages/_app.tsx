import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { getCookie } from 'cookies-next'
import { RecoilRoot } from 'recoil'
import Header from '@/utils/Header'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // useEffect(() => {
  //   const token = getCookie('token')

  //   if (
  //     !token &&
  //     (router.pathname === '/signup' || router.pathname === '/login')
  //   ) {
  //     return
  //   }

  //   if (!token) {
  //     router.push('/login')
  //     return
  //   }

  //   const userId = JSON.parse(atob(token.split('.')[1])).userId

  //   if (
  //     token &&
  //     (router.pathname === '/login' || router.pathname === '/signup')
  //   ) {
  //     router.push(`/home/${userId}`)
  //     return
  //   }
  // }, [router])

  return (
    <RecoilRoot>
      <Header />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
