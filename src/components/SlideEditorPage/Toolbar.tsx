import type React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { slidesState } from '../../recoil/atoms'
import styles from '../../styles/Toolbar.module.css'
import type { Editor } from '@tiptap/react'
import type { SlideElement } from '../../types/Slide'

type ToolbarProps = {
  editor: Editor | null
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [slides, setSlides] = useRecoilState(slidesState)
  const router = useRouter()

  const addTextBox = () => {
    const newTextBox: SlideElement = {
      id: uuidv4(),
      type: 'text',
      content: 'サンプルテキスト',
      x: 10,
      y: 10,
      width: 150,
      height: 40,
    }
    const currentSlideId = router.query.id as string
    const updatedSlides = slides.map((s) =>
      s.id === currentSlideId
        ? { ...s, elements: [...(s.elements || []), newTextBox] }
        : s,
    )
    setSlides(updatedSlides)
    if (!editor) return
    editor.commands.setContent(newTextBox.content)
  }

  if (!editor) return null

  return (
    <div className={styles.toolbar}>
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
      <button
        onClick={addTextBox}
        className={`${styles.button} ${styles.addTextBoxButton}`}
      >
        Add Text Box
      </button>
    </div>
  )
}

export default Toolbar
