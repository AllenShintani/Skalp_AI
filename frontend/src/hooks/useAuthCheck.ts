import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const useAuthCheck = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const publicRoutes = ['/signup', '/login']
      const isPublicRoute = publicRoutes.includes(router.pathname)

      try {
        const response = await fetch('/api/checkAuth', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await response.json()
        const isAuthenticated = response.ok && data.isAuthenticated

        if (isMounted) {
          if (!isAuthenticated && !isPublicRoute) {
            await router.push('/login')
          } else if (isAuthenticated && isPublicRoute) {
            await router.push('/workspace')
          }
        }
      } catch (error) {
        console.error('Error checking authentication', error)
        if (isMounted && !isPublicRoute) {
          await router.push('/login')
        }
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  return { loading }
}

export default useAuthCheck
