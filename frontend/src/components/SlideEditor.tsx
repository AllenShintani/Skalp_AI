import { useCallback, useEffect, useRef, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import ToolBar from './ToolBar'
import styles from './SlideEditor.module.css'
import DraggableTextBox from './DraggableTextBox'
import type { TextBox } from '@/types/Slide'
import { Text } from '@tiptap/extension-text'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Underline } from '@tiptap/extension-underline'
import { Strike } from '@tiptap/extension-strike'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import { FontSize } from '@/components/extensions/FontSize'
import Sidebar from './Sidebar'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'

const SlideEditor = () => {
  const [textboxes, setTextboxes] = useState<TextBox[]>([])
  const [countTextbox, setCountTextbox] = useState(0)
  const [currentId, setCurrentId] = useState(0)
  const [scale, setScale] = useState(1)
  const scaleRef = useRef(scale) // useRef to keep track of the latest scale value

  const createTextbox = () => {
    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [
        StarterKit,
        Text,
        TextStyle,
        Document,
        Paragraph,
        Bold,
        Italic,
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
        Strike,
        FontFamily.configure({ types: ['textStyle'] }),
        FontSize,
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
    })
    setTextboxes((prev) => [
      ...prev,
      {
        editor: editor,
        textBoxId: countTextbox,
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        isSelected: false,
      },
    ])
    setCountTextbox((prev) => prev + 1)
  }

  const selectTextBox = (id: number) => {
    console.log('select textbox', id)
    setCurrentId(id)
  }

  const changeScale = useCallback(() => {
    const editorElement = document.getElementById('editor')
    if (!editorElement) return

    const editorWidth = editorElement.offsetWidth
    const editorHeight = editorElement.offsetHeight
    const preScale = scaleRef.current // use the ref value

    const targetWidth = 1000
    const targetHeight = 1000 * (9 / 16)

    let newScale = preScale

    // ウィンドウが小さくなったときの処理
    while (
      targetWidth * newScale > editorWidth - 10 ||
      targetHeight * newScale > editorHeight
    ) {
      newScale -= 0.05
    }

    // ウィンドウが大きくなったときの処理
    while (
      targetWidth * newScale < editorWidth - 100 &&
      targetHeight * newScale < editorHeight
    ) {
      newScale += 0.05
    }

    setScale(newScale)
    scaleRef.current = newScale // update the ref value
  }, [])

  useEffect(() => {
    // 初回マウント時に一度だけ実行
    changeScale()

    const handleResizeWindow = () => {
      changeScale()
    }

    window.addEventListener('resize', handleResizeWindow)
    return () => {
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [changeScale]) // changeScaleを依存配列に追加

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.toolbar}>
          <h1>Edit</h1>
          <button onClick={changeScale}>scaling</button>
          <ToolBar
            currentId={currentId}
            createTextbox={createTextbox}
            textboxes={textboxes}
          />
        </div>

        <div
          className={styles.editor}
          id="editor"
        >
          <DndContext>
            <div
              className={styles.slide}
              id="slide"
              style={{ transform: `scale(${scale})` }}
            >
              {textboxes?.map((textbox) => (
                <div
                  onClick={() => selectTextBox(textbox.textBoxId)}
                  key={textbox.textBoxId}
                >
                  <DraggableTextBox textbox={textbox} />
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default SlideEditor
