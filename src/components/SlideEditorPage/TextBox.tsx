import type React from 'react'
import { useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import styles from '../../styles/TextBox.module.css'

type TextBoxProps = {
  editor: Editor
  width?: number
  height?: number
}

const TextBox: React.FC<TextBoxProps> = ({
  editor,
  width = 20,
  height = 40,
}) => {
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const textBoxRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={styles.textBox}
      ref={textBoxRef}
      style={{ width, height }}
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
