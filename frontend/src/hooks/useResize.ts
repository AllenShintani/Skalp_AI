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
    x: 0,
    y: 0,
  })
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

      setSlides((prevSlides) =>
        prevSlides.map((slide) => {
          const updateContentSize = (content) => {
            if (content.id === contentId) {
              const newOptions = handleResize(
                e,
                resizeStart,
                { width: content.width, height: content.height },
                { x: content.x, y: content.y },
                resizeDirection,
              )
              if (newOptions.width < 10 || newOptions.height < 10)
                return content

              setResizeStart({ x: e.clientX, y: e.clientY }) // Update resize start

              return {
                ...content,
                width: newOptions.width,
                height: newOptions.height,
                x: newOptions.x,
                y: newOptions.y,
              }
            }
            return content
          }

          return {
            ...slide,
            textboxes: slide.textboxes.map(updateContentSize),
            images: slide.images.map(updateContentSize),
          }
        }),
      )
    },
    [isResizing, resizeStart, resizeDirection, contentId, setSlides],
  )

  const handleResizeMouseUp = useCallback(() => {
    if (!isResizing) return
    setIsResizing(false)
    setResizeDirection('default')
  }, [isResizing])

  return {
    isResizing,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  }
}
