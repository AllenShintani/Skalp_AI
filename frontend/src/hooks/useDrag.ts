import { slidesState } from '@/jotai/atoms'
import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import type { Slide, TextBox, SlideImage } from '@/types/Slide'

export const useDrag = (
  initialPosition: { x: number; y: number },
  contentId: string,
  size: { width: number; height: number },
  scale: number, // 新しい引数
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
          x: (e.clientX - content.x * scale) / scale, 
          y: (e.clientY - content.y * scale) / scale, 
        })
        setIsDragging(true)
      }
    },
    [slides, contentId, scale],
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
        prevSlides.map((slide: Slide) => {
          const updateContentPosition = (content: TextBox | SlideImage) => {

            if (content.id === contentId) {
              const centerPositionOfTextBox = {
                x: content.x + size.width / 2,
                y: content.y + size.height / 2,
              }
              const movingDistance = {
                x: Math.abs(e.clientX / scale - dragStart.x - content.x),
                y: Math.abs(e.clientY / scale - dragStart.y - content.y),
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
                  return { ...content, x: e.clientX / scale - dragStart.x }
                }
                setIsHorizontalCenter(false)
              } else if (!isHorizontalCenter && isVerticalCenter) {
                if (movingDistance.x < 15) {
                  return { ...content, y: e.clientY / scale - dragStart.y }
                }
                setIsVerticalCenter(false)
              }

              return {
                ...content,
                x: e.clientX / scale - dragStart.x, 
                y: e.clientY / scale - dragStart.y, 
              }
            }
            return content
          }

          return {
            ...slide,
            textboxes: slide.textboxes.map(
              updateContentPosition as (content: TextBox) => TextBox,
            ),
            images: slide.images.map(
              updateContentPosition as (content: SlideImage) => SlideImage,
            ),
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
      scale,
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
