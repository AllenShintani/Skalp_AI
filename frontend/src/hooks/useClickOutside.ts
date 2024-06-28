import { useEffect, useRef } from 'react'

type Handler = (event: MouseEvent) => void

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: Handler,
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handler])

  return ref
}
