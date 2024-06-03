import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'

import { useState, useCallback, useEffect } from 'react'
import type { TextBox } from '@/types/Slide'

type Props = {
  textbox: TextBox
}

const handleResize = (
  e: MouseEvent,
  resizeStart: { x: number; y: number },
  size: { width: number; height: number },
  position: { x: number; y: number },
  direction: string,
) => {
  switch (direction) {
    case 'se':
      return {
        width: size.width + (e.clientX - resizeStart.x),
        height: size.height + (e.clientY - resizeStart.y),
        x: position.x,
        y: position.y,
      }

    case 's':
      return {
        width: size.width,
        height: size.height + (e.clientY - resizeStart.y),
        x: position.x,
        y: position.y,
      }
    case 'sw':
      return {
        width: size.width - (e.clientX - resizeStart.x),
        height: size.height + (e.clientY - resizeStart.y),
        x: position.x + (e.clientX - resizeStart.x),
        y: position.y,
      }
    case 'w': {
      return {
        width: size.width - (e.clientX - resizeStart.x),
        height: size.height,
        x: position.x + (e.clientX - resizeStart.x),
        y: position.y,
      }
    }
    case 'nw': {
      return {
        width: size.width - (e.clientX - resizeStart.x),
        height: size.height - (e.clientY - resizeStart.y),
        x: position.x + (e.clientX - resizeStart.x),
        y: position.y + (e.clientY - resizeStart.y),
      }
    }
    case 'n': {
      return {
        width: size.width,
        height: size.height - (e.clientY - resizeStart.y),
        x: position.x,
        y: position.y + (e.clientY - resizeStart.y),
      }
    }
    case 'ne': {
      return {
        width: size.width + (e.clientX - resizeStart.x),
        height: size.height - (e.clientY - resizeStart.y),
        x: position.x,
        y: position.y + (e.clientY - resizeStart.y),
      }
    }
    case 'e': {
      return {
        width: size.width + (e.clientX - resizeStart.x),
        height: size.height,
        x: position.x,
        y: position.y,
      }
    }
    default:
      return {
        width: size.width,
        height: size.height,
        x: position.x,
        y: position.y,
      }
  }
}

const handleResizeDivs = [
  { direction: 'se', className: styles.resizeHandleSE },
  { direction: 's', className: styles.resizeHandleS },
  { direction: 'sw', className: styles.resizeHandleSW },
  { direction: 'w', className: styles.resizeHandleW },
  { direction: 'nw', className: styles.resizeHandleNW },
  { direction: 'n', className: styles.resizeHandleN },
  { direction: 'ne', className: styles.resizeHandleNE },
  { direction: 'e', className: styles.resizeHandleE },
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
  const [resizeDirection, setResizeDirection] = useState('')
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

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      console.log('resizeMouseDown', direction)
      e.stopPropagation()
      setResizeDirection(direction)
      setIsResizing(true)
      setResizeStart({ x: e.clientX, y: e.clientY })
      textbox.isSelected = true
    },
    [textbox],
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
      if (newOptions.width < -10 || newOptions.height < -10) {
        return
      }
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
    setResizeDirection('')
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
