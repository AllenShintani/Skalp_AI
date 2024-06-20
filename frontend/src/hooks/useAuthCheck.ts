import { useRouter } from 'next/router'
import { useEffect, useState, useRef, useCallback } from 'react'

const useAuthCheck = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)
  const isRedirectingRef = useRef(false)

  const publicRoutes = ['/signup', '/login']
  const isPublicRoute = publicRoutes.includes(router.pathname)

  const redirectTo = useCallback(
    async (path: string) => {
      if (isRedirectingRef.current) return

      isRedirectingRef.current = true
      await router.push(path)
      isRedirectingRef.current = false
    },
    [router],
  )

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/checkAuth', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      const isAuthenticated = response.ok && data.isAuthenticated

      if (!isMountedRef.current) return

      if (!isAuthenticated && !isPublicRoute) {
        await redirectTo('/login')
      } else if (isAuthenticated && isPublicRoute) {
        await redirectTo('/workspace')
      }
    } catch (error) {
      console.error('Error checking authentication', error)
      if (isMountedRef.current && !isPublicRoute) {
        await redirectTo('/login')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [isPublicRoute, redirectTo])

  useEffect(() => {
    isMountedRef.current = true
    checkAuth()

    return () => {
      isMountedRef.current = false
    }
  }, [checkAuth, router.pathname])

  return { loading }
}

export default useAuthCheck
