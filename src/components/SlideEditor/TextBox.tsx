import type React from 'react'
import { useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import styles from '../../styles/TextBox.module.css'

type TextBoxProps = {
  editor: Editor
}

const TextBox: React.FC<TextBoxProps> = ({ editor }) => {
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const textBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = resizeHandleRef.current

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = textBoxRef.current?.offsetWidth || 0
      const startHeight = textBoxRef.current?.offsetHeight || 0

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX)
        const newHeight = startHeight + (e.clientY - startY)
        if (textBoxRef.current) {
          textBoxRef.current.style.width = `${newWidth}px`
          textBoxRef.current.style.height = `${newHeight}px`
        }
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    handle?.addEventListener('mousedown', handleMouseDown)

    return () => {
      handle?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return (
    <div
      className={styles.textBox}
      ref={textBoxRef}
    >
      <EditorContent
        editor={editor}
        className={styles.editorContent}
      />
      <div
        ref={resizeHandleRef}
        className={styles.resizeHandle}
      />
    </div>
  )
}

export default TextBox
