import { useState, useCallback } from 'react'
import type { Direction, ResizeOptions } from '@/types/DraggableTextBox'
import { slidesState } from '@/jotai/atoms'
import { useAtom } from 'jotai'
import type { TextBox, Slide, SlideImage } from '@/types/Slide'

const handleResize = (
  e: MouseEvent,
  resizeStart: { x: number; y: number },
  size: { width: number; height: number },
  position: { x: number; y: number },
  direction: Direction,
  scale: number,
): ResizeOptions => {
  const deltaX = (e.clientX - resizeStart.x) / scale
  const deltaY = (e.clientY - resizeStart.y) / scale

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
  scale: number,
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
        prevSlides.map((slide: Slide) => {
          const updateContentSize = (content: TextBox | SlideImage) => {
            if (content.id === contentId) {
              const newOptions = handleResize(
                e,
                resizeStart,
                { width: content.width, height: content.height },
                { x: content.x, y: content.y },
                resizeDirection,
                scale,
              )
              if (newOptions.width < 10 || newOptions.height < 10)
                return content

              setResizeStart({ x: e.clientX, y: e.clientY })

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
            textboxes: slide.textboxes.map(
              updateContentSize as (content: TextBox) => TextBox,
            ),
            images: slide.images.map(
              updateContentSize as (content: SlideImage) => SlideImage,
            ),
          }
        }),
      )
    },
    [isResizing, resizeStart, resizeDirection, contentId, setSlides, scale],
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
