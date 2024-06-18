import { useState, useCallback } from 'react'
import type { Direction, ResizeOptions } from '@/types/DraggableTextBox'
import { slidesState } from '@/jotai/atoms'
import { useAtom } from 'jotai'

const handleResize = (
  e: MouseEvent,
  resizeStart: { x: number; y: number },
  size: { width: number; height: number },
  position: { x: number; y: number },
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
  initialSize: { width: number; height: number },
  initialPosition: { x: number; y: number },
  contentId: string,
) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<Direction>('default')
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number }>({
    x: initialSize.width,
    y: initialSize.height,
  })
  const [size, setSize] = useState(initialSize)
  const [position, setPosition] = useState(initialPosition)
  const [, setSlides] = useAtom(slidesState)

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
    setSlides((prev) =>
      prev.map((slide) => {
        const allcontent = [...slide.textboxes, ...slide.images]
        allcontent.map((content) => {
          if (content.id === contentId) {
            content.width = size.width
            content.height = size.height
          }
          return content
        })
        return slide
      }),
    )
  }, [contentId, isResizing, setSlides, size.height, size.width])

  return {
    isResizing,
    size,
    position,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  }
}
