import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DraggableTextBox.module.css'

import { useState, useCallback, useEffect } from 'react'
import type { TextBox } from '@/types/Slide'

type Props = {
  textbox: TextBox
}

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
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsResizing(true)
      setResizeStart({ x: e.clientX, y: e.clientY })
      textbox.isSelected = true
    },
    [textbox],
  )

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = size.width + deltaX
      const newHeight = size.height + deltaY
      setSize({ width: newWidth, height: newHeight })
      setResizeStart({ x: e.clientX, y: e.clientY })
    },
    [isResizing, resizeStart, size],
  )

  const handleResizeMouseUp = useCallback(() => {
    if (!isResizing) return
    setIsResizing(false)
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
        className={styles.resizeHandle}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}

export default DraggableTextBox
