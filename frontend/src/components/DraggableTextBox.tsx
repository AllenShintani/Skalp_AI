import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'
import { useState, useCallback, useEffect } from 'react'
import type { TextBox } from '@/types/Slide'

type Props = {
  textbox: TextBox
}

import type {
  Direction,
  ResizeOptions,
  ResizeDivs,
} from '@/types/DraggableTextBox'
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
const handleResizeDivs: ResizeDivs[] = [
  { direction: 'north', className: styles.resizeHandleNorth },
  { direction: 'northEast', className: styles.resizeHandleNorthEast },
  { direction: 'east', className: styles.resizeHandleEast },
  { direction: 'southEast', className: styles.resizeHandleSouthEast },
  { direction: 'south', className: styles.resizeHandleSouth },
  { direction: 'southWest', className: styles.resizeHandleSouthWest },
  { direction: 'west', className: styles.resizeHandleWest },
  { direction: 'northWest', className: styles.resizeHandleNorthWest },
]

const DraggableTextBox: React.FC<Props> = ({ textbox }) => {
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

  const [isVerticalCenter, setIsVerticalCenter] = useState(false)
  const [isHorizontalCenter, setIsHorizontalCenter] = useState(false)

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none', // Prevent text selection(入力の無効化はtiptapにメソッドが存在する為、注意が必要)
  }

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
      if (
        size.height / 2 + position.y > 279.5 &&
        size.height / 2 + position.y < 283.5 &&
        !isHorizontalCenter
      ) {
        setPosition({ x: position.x, y: 281.5 - size.height / 2 })
        setIsHorizontalCenter(true)
        return
      }
      if (
        size.width / 2 + position.x > 498 &&
        size.width / 2 + position.x < 502 &&
        !isVerticalCenter
      ) {
        setPosition({ x: 500 - size.width / 2, y: position.y })
        setIsVerticalCenter(true)
        return
      }
      if (isHorizontalCenter && isVerticalCenter) {
        if (
          Math.abs(e.clientX - dragStart.x - position.x) < 10 &&
          Math.abs(e.clientY - dragStart.y - position.y) < 10
        ) {
          setPosition({
            x: position.x,
            y: position.y,
          })
          return
        }
        setIsHorizontalCenter(false)
        setIsVerticalCenter(false)
      } else if (isHorizontalCenter && !isVerticalCenter) {
        if (Math.abs(e.clientY - dragStart.y - position.y) < 10) {
          setPosition({
            x: e.clientX - dragStart.x,
            y: position.y,
          })
          return
        }
        setIsHorizontalCenter(false)
      } else if (!isHorizontalCenter && isVerticalCenter) {
        if (Math.abs(e.clientX - dragStart.x - position.x) < 10) {
          setPosition({
            x: position.x,
            y: e.clientY - dragStart.y,
          })
          return
        }
        setIsVerticalCenter(false)
      }
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [
      isDragging,
      dragStart,
      size,
      position,
      isVerticalCenter,
      isHorizontalCenter,
    ],
  )
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

  return (
    <div
      style={style}
      onMouseDown={handleDragMouseDown}
      className={styles.textBox}
    >
      {isVerticalCenter && isDragging && (
        <div className={styles.verticalLine} />
      )}
      {isHorizontalCenter && isDragging && (
        <div className={styles.horizontalLine} />
      )}

      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={styles.editorContent}
      >
        <EditorContent editor={textbox.editor} />
      </div>

      {handleResizeDivs.map((div) => (
        <div
          key={div.direction}
          className={div.className}
          onMouseDown={(e) => handleResizeMouseDown(e, div.direction)}
        />
      ))}
    </div>
  )
}

export default DraggableTextBox
