import { useState, useCallback } from 'react'

export const useDrag = (initialPosition: { x: number; y: number }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState(initialPosition)
  const [isVerticalCenter, setIsVerticalCenter] = useState(false)
  const [isHorizontalCenter, setIsHorizontalCenter] = useState(false)

  const handleDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      setIsDragging(true)
    },
    [position.x, position.y],
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
      //変数設定
      const SLIDESIZE_HALF = { width: 500, height: 281.5 }
      const centerPositionOfTextBox = {
        x: position.x + 125,
        y: position.y + 80,
      }
      const movingDistance = {
        x: Math.abs(e.clientX - dragStart.x - position.x),
        y: Math.abs(e.clientY - dragStart.y - position.y),
      }

      //縦の座標を中央に寄せる処理
      if (
        centerPositionOfTextBox.y > SLIDESIZE_HALF.height - 2 &&
        centerPositionOfTextBox.y < SLIDESIZE_HALF.height + 2 &&
        !isHorizontalCenter
      ) {
        setPosition({ x: position.x, y: SLIDESIZE_HALF.height - 80 })
        setIsHorizontalCenter(true)
        return
      }

      //横の座標を中央に寄せる処理
      if (
        centerPositionOfTextBox.x > SLIDESIZE_HALF.width - 2 &&
        centerPositionOfTextBox.x < SLIDESIZE_HALF.width + 2 &&
        !isVerticalCenter
      ) {
        setPosition({ x: SLIDESIZE_HALF.width - 125, y: position.y })
        setIsVerticalCenter(true)
        return
      }

      //引っ掛かりをもたせる処理->if-elseif-elseif
      if (isHorizontalCenter && isVerticalCenter) {
        if (movingDistance.x < 15 && movingDistance.y < 15) {
          setPosition({ x: position.x, y: position.y })
          return
        }
        setIsHorizontalCenter(false)
        setIsVerticalCenter(false)
      } else if (isHorizontalCenter && !isVerticalCenter) {
        if (movingDistance.y < 15) {
          setPosition({ x: e.clientX - dragStart.x, y: position.y })
          return
        }
        setIsHorizontalCenter(false)
      } else if (!isHorizontalCenter && isVerticalCenter) {
        if (movingDistance.x < 15) {
          setPosition({ x: position.x, y: e.clientY - dragStart.y })
          return
        }
        setIsVerticalCenter(false)
      }

      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    },
    [isDragging, dragStart, position, isVerticalCenter, isHorizontalCenter],
  )

  return {
    isDragging,
    position,
    isVerticalCenter,
    isHorizontalCenter,
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMouseMove,
  }
}
