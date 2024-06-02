import type React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { EditorContent } from '@tiptap/react'
import styles from './DemoSlideEditor.module.css'

import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { text } from 'stream/consumers'
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

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    boxSizing: 'border-box',
    outline: textbox.isSelected ? 'solid' : 'none',
    outlineColor: '#4a90e2',
    userSelect: 'none', // Prevent text selection(入力の無効化はtiptapにメソッドが存在する為、注意が必要)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    textbox.isSelected = true
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
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
    </div>
  )
}

export default DraggableTextBox
