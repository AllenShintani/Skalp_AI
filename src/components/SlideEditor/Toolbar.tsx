import type React from 'react'
import type { Editor } from '@tiptap/react'
import styles from '../../styles/Toolbar.module.css'

type ToolbarProps = {
  editor: Editor | null
  onCreateNewSlide: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, onCreateNewSlide }) => {
  if (!editor) {
    return null
  }

  return (
    <div className={styles.toolbar}>
      <button
        onClick={onCreateNewSlide}
        className={`${styles.button} ${styles.createNewSlideButton}`}
      >
        Create New Slide
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.isActive : ''}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.isActive : ''}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? styles.isActive : ''}
      >
        U
      </button>
      <select
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        value={editor.getAttributes('textStyle').fontFamily || 'Arial'}
      >
        <option value="Arial">Arial</option>
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="Georgia">Georgia</option>
      </select>
      <select
        onChange={(e) =>
          editor.chain().focus().setFontSize(e.target.value).run()
        }
        value={editor.getAttributes('fontSize').size || '16'}
      >
        <option value="12">12px</option>
        <option value="16">16px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="32">32px</option>
      </select>
    </div>
  )
}

export default Toolbar
