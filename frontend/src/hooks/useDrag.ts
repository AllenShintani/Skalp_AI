import { useState, useCallback, useEffect } from 'react'
import type { TextBox } from '@/types/Slide'

import type { Direction, ResizeOptions } from '@/types/DraggableTextBox'
type Props = {
  textbox: TextBox
}
export const useDrag = ({ textbox }: Props) => {
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

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState({ x: textbox.x, y: textbox.y })
  const [size, setSize] = useState({
    width: textbox.width,
    height: textbox.height,
  })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<Direction>('default')
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number }>({
    x: size.width,
    y: size.height,
  })

  const handleDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      textbox.isSelected = true
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      setIsDragging(true)
    },
    [position.x, position.y, textbox],
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
    if (!isDragging) return
    setIsDragging(false)
    setDragStart(null)
    textbox.isSelected = false
  }, [isDragging, textbox])

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
    textbox.isSelected = false
  }, [isResizing, textbox])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMouseMove(e)
      handleResizeMouseMove(e)
    },
    [handleDragMouseMove, handleResizeMouseMove],
  )
  const handleMouseUp = useCallback(() => {
    handleDragMouseUp()
    handleResizeMouseUp()
  }, [handleDragMouseUp, handleResizeMouseUp])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    handleDragMouseMove,
    handleDragMouseUp,
    handleMouseMove,
    handleMouseUp,
    handleResizeMouseMove,
    handleResizeMouseUp,
  ])

  return {
    isDragging,
    dragStart,
    handleDragMouseDown,
  }
}
