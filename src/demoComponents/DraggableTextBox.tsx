import type React from 'react'
import { EditorContent } from '@tiptap/react'
import styles from './DemoSlideEditor.module.css'

import { useState } from 'react'
import type { TextBox } from '@/types/Slide'

type Props = {
  textbox: TextBox
}

const DraggableTextBox: React.FC<Props> = ({ textbox }) => {
  const [idDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState({ x: textbox.x, y: textbox.y })
  const [size, setSize] = useState({
    width: textbox.width,
    height: textbox.height,
  })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState<{
    x: number
    y: number
  }>({ x: size.width, y: size.height })

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid 1px blue' : 'none',
    userSelect: 'none', // Prevent text selection(入力の無効化はtiptapにメソッドが存在する為、注意が必要)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    textbox.isSelected = true
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return
    if (!textbox.isSelected) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!idDragging) return
    textbox.isSelected = false
    setIsDragging(false)
    if (!dragStart) return
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
  }

  // const [preNewSize, setPreNewSize] = useState({ width: 0, height: 0 })
  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return
    e.stopPropagation()
    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y
    const newWidth = size.width + deltaX
    const newHeight = size.height + deltaY
    setSize({ width: newWidth, height: newHeight })
    setResizeStart({ x: e.clientX, y: e.clientY })
  }

  const handleResizeMouseUp = () => {
    setIsResizing(false)
  }
  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={styles.textBox}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <EditorContent editor={textbox.editor} />
      </div>
      <div
        className={styles.resizeHandle}
        onMouseDown={handleResizeMouseDown}
        onMouseMove={handleResizeMouseMove}
        onMouseUp={handleResizeMouseUp}
      />
    </div>
  )
}

export default DraggableTextBox
