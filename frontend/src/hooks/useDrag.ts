import { slidesState } from '@/jotai/atoms'
import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'

export const useDrag = (
  initialPosition: { x: number; y: number },
  contentId: string,
  size: { width: number; height: number },
) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [isVerticalCenter, setIsVerticalCenter] = useState(false)
  const [isHorizontalCenter, setIsHorizontalCenter] = useState(false)
  const [slides, setSlides] = useAtom(slidesState)

  const handleDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const content = slides
        .flatMap((slide) => [...slide.textboxes, ...slide.images])
        .find((content) => content.id === contentId)
      if (content) {
        setDragStart({
          x: e.clientX - content.x,
          y: e.clientY - content.y,
        })
        setIsDragging(true)
      }
    },
    [slides, contentId],
  )

  const handleDragMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsHorizontalCenter(false)
    setIsVerticalCenter(false)
    setIsDragging(false)
    setDragStart(null)
  }, [isDragging])

  const handleDragMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return

      // スライドサイズの半分
      const SLIDESIZE_HALF = {
        width: 500,
        height: 281.5,
      }

      setSlides((prevSlides) =>
        prevSlides.map((slide) => {
          const updateContentPosition = (content) => {
            if (content.id === contentId) {
              const centerPositionOfTextBox = {
                x: content.x + size.width / 2,
                y: content.y + size.height / 2,
              }
              const movingDistance = {
                x: Math.abs(e.clientX - dragStart.x - content.x),
                y: Math.abs(e.clientY - dragStart.y - content.y),
              }

              // 縦の座標を中央に寄せる処理
              if (
                centerPositionOfTextBox.y > SLIDESIZE_HALF.height - 2 &&
                centerPositionOfTextBox.y < SLIDESIZE_HALF.height + 2 &&
                !isHorizontalCenter
              ) {
                setIsHorizontalCenter(true)
                return {
                  ...content,
                  y: SLIDESIZE_HALF.height - size.height / 2,
                }
              }

              // 横の座標を中央に寄せる処理
              if (
                centerPositionOfTextBox.x > SLIDESIZE_HALF.width - 2 &&
                centerPositionOfTextBox.x < SLIDESIZE_HALF.width + 2 &&
                !isVerticalCenter
              ) {
                setIsVerticalCenter(true)
                return { ...content, x: SLIDESIZE_HALF.width - size.width / 2 }
              }

              // 引っ掛かりをもたせる処理
              if (isHorizontalCenter && isVerticalCenter) {
                if (movingDistance.x < 15 && movingDistance.y < 15) {
                  return content
                }
                setIsHorizontalCenter(false)
                setIsVerticalCenter(false)
              } else if (isHorizontalCenter && !isVerticalCenter) {
                if (movingDistance.y < 15) {
                  return { ...content, x: e.clientX - dragStart.x }
                }
                setIsHorizontalCenter(false)
              } else if (!isHorizontalCenter && isVerticalCenter) {
                if (movingDistance.x < 15) {
                  return { ...content, y: e.clientY - dragStart.y }
                }
                setIsVerticalCenter(false)
              }

              return {
                ...content,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
              }
            }
            return content
          }

          return {
            ...slide,
            textboxes: slide.textboxes.map(updateContentPosition),
            images: slide.images.map(updateContentPosition),
          }
        }),
      )
    },
    [
      isDragging,
      dragStart,
      size,
      isHorizontalCenter,
      isVerticalCenter,
      contentId,
      setSlides,
    ],
  )

  return {
    isDragging,
    isVerticalCenter,
    isHorizontalCenter,
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMouseMove,
  }
}
