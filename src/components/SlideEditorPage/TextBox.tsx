import type React from 'react'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import styles from '../../styles/TextBox.module.css'

type TextBoxProps = {
  editor: Editor
  width?: number
  height?: number
  onResize?: (width: number, height: number) => void
  isActive: boolean
}

const TextBox: React.FC<TextBoxProps> = ({
  editor,
  width = 150,
  height = 40,
  onResize,
  isActive,
}) => {
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const textBoxRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [size, setSize] = useState({ width, height })
  const [startSize, setStartSize] = useState({ width, height })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setStartSize(size)
    setStartPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = startSize.width + (e.clientX - startPosition.x)
      const newHeight = startSize.height + (e.clientY - startPosition.y)
      setSize({ width: newWidth, height: newHeight })
    },
    [isResizing, startSize, startPosition],
  )

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return
    setIsResizing(false)
    if (!onResize) return
    onResize(size.width, size.height)
  }, [isResizing, onResize, size.width, size.height])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    if (!isResizing) {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      className={`${styles.textBox} ${isActive ? styles.active : styles.inactive}`}
      ref={textBoxRef}
      style={{ width: size.width, height: size.height }}
    >
      <EditorContent
        editor={editor}
        className={styles.editorContent}
      />
      <div
        ref={resizeHandleRef}
        className={styles.resizeHandle}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default TextBox
