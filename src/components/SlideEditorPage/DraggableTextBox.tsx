import type React from 'react'
import { useState } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import type { SlideElement } from '../../types/Slide'
import TextBox from './TextBox'
import styles from '../../styles/DraggableTextBox.module.css'

type DraggableTextBoxProps = {
  element: SlideElement
  onClick: (event: React.MouseEvent) => void
  onUpdate: (x: number, y: number) => void
  isActive: boolean
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  element,
  onClick,
  onUpdate,
  isActive,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [position, setPosition] = useState({ x: element.x, y: element.y })
  const [size, setSize] = useState({
    width: element.width,
    height: element.height,
  })

  const editor = useEditor({
    extensions: [
      Text,
      Document,
      Paragraph,
      StarterKit,
      TextStyle,
      Underline,
      FontFamily.configure({ types: ['textStyle'] }),
    ],
    content: element.content,
  })

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isActive) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      if (dragStart) {
        onUpdate(position.x, position.y)
      }
    }
  }

  const handleResize = (width: number, height: number) => {
    setSize({ width, height })
  }

  return (
    <div
      className={`${styles.draggableTextBox} ${isActive ? styles.active : styles.inactive}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={!isActive ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onClick={(event) => onClick(event)} // event引数を渡す
    >
      {editor && (
        <TextBox
          editor={editor}
          width={size.width}
          height={size.height}
          onResize={handleResize}
          isActive={isActive}
        />
      )}
    </div>
  )
}

export default DraggableTextBox
