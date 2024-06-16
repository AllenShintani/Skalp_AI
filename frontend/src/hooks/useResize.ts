import { useState, useCallback } from 'react'
import type { Direction, ResizeOptions } from '@/types/DraggableTextBox'

type Size = { width: number; height: number }
type Position = { x: number; y: number }

const handleResize = (
  e: MouseEvent,
  resizeStart: { x: number; y: number },
  size: Size,
  position: Position,
  direction: Direction,
): ResizeOptions => {
  const deltaX = e.clientX - resizeStart.x
  const deltaY = e.clientY - resizeStart.y

  const options: { [key in Direction]: ResizeOptions } = {
    north: {
      width: size.width,
      height: size.height - deltaY,
      x: position.x,
      y: position.y + deltaY,
    },
    northEast: {
      width: size.width + deltaX,
      height: size.height - deltaY,
      x: position.x,
      y: position.y + deltaY,
    },
    east: {
      width: size.width + deltaX,
      height: size.height,
      x: position.x,
      y: position.y,
    },
    southEast: {
      width: size.width + deltaX,
      height: size.height + deltaY,
      x: position.x,
      y: position.y,
    },
    south: {
      width: size.width,
      height: size.height + deltaY,
      x: position.x,
      y: position.y,
    },
    southWest: {
      width: size.width - deltaX,
      height: size.height + deltaY,
      x: position.x + deltaX,
      y: position.y,
    },
    west: {
      width: size.width - deltaX,
      height: size.height,
      x: position.x + deltaX,
      y: position.y,
    },
    northWest: {
      width: size.width - deltaX,
      height: size.height - deltaY,
      x: position.x + deltaX,
      y: position.y + deltaY,
    },
    default: {
      width: size.width,
      height: size.height,
      x: position.x,
      y: position.y,
    },
  }

  return options[direction]
}

export const useResize = (
  initialSize: Size,
  initialPosition: Position
) => {
  const [isResizing, setIsResizing] = useState(false)
  const [size, setSize] = useState(initialSize)
  const [position, setPosition] = useState(initialPosition)
  const [resizeDirection, setResizeDirection] = useState<Direction>('default')
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number }>({
    x: initialSize.width,
    y: initialSize.height,
  })

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: Direction) => {
      e.stopPropagation()
      setResizeDirection(direction)
      setIsResizing(true)
      setResizeStart({ x: e.clientX, y: e.clientY })
    },
    [],
  )

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const newOptions = handleResize(
        e,
        resizeStart,
        size,
        position,
        resizeDirection,
      )
      if (newOptions.width < -10 || newOptions.height < -10) return

      setPosition({ x: newOptions.x, y: newOptions.y })
      setSize({
        width: newOptions.width,
        height: newOptions.height,
      })
      setResizeStart({ x: e.clientX, y: e.clientY })
    },
    [isResizing, resizeStart, size, position, resizeDirection],
  )

  const handleResizeMouseUp = useCallback(() => {
    if (!isResizing) return
    setIsResizing(false)
    setResizeDirection('default')
  }, [isResizing])

  return {
    isResizing,
    size,
    position,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  }
}
