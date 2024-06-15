import { useState, useCallback } from 'react'

type Position = { x: number; y: number }

export const useDrag = (initialPosition: Position) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [position, setPosition] = useState(initialPosition)

  const handleDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      setIsDragging(true)
    },
    [position.x, position.y],
  )

  const handleDragMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleDragMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
  }, [])

  return {
    isDragging,
    position,
    handleDragMouseDown,
    handleDragMouseMove,
    handleDragMouseUp,
  }
}