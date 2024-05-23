import React, { useRef, useEffect } from 'react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import styles from '../../styles/TextBox.module.css'

const TextBox = () => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    content: `
        <p>ここにテキストが追加されていく</p>
      `,
  })

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

  if (!editor) {
    return null
  }

  return (
    <div
      className={styles.textBox}
      ref={textBoxRef}
    >
      <EditorContent
        editor={editor}
        className={styles.editorContent}
      />
    </div>
  )
}

export default TextBox
