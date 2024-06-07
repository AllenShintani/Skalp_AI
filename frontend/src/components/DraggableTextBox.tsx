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
      console.log(textbox)
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
  }, [isDragging])

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
      <div onMouseDown={(e) => e.stopPropagation()}>
        <EditorContent editor={textbox.editor} />
      </div>
      <div
        className={styles.resizeHandles}
        style={{ display: isResizing ? 'block' : '' }}
      >
        {handleResizeDivs.map((div) => (
          <div
            key={div.direction}
            className={div.className}
            onMouseDown={(e) => handleResizeMouseDown(e, div.direction)}
          />
        ))}
      </div>
    </div>
  )
}

export default DraggableTextBox
