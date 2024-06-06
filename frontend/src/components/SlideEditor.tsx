import { useState } from 'react'
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
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'

const SlideEditor = () => {
  const [textboxes, setTextboxes] = useState<TextBox[]>([])
  const [countTextbox, setCountTextbox] = useState(0)
  const [currentId, setCurrentId] = useState(0)

  const createTextbox = () => {
    const editor = new Editor({
      content: `
        <p>Example Text</p>
        <h2>Heading</h2>
        <p style="text-align: center">first paragraph</p>
        <p style="text-align: right">second paragraph</p>
      `,
      extensions: [
        StarterKit,
        Text,
        TextStyle,
        Document,
        Paragraph,
        Bold,
        Italic,
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
        width: 200,
        height: 40,
        isSelected: false,
      },
    ])
    setCountTextbox((prev) => prev + 1)
  }

  const selectTextBox = (id: number) => {
    console.log('select textbox', id)
    setCurrentId(id)
  }

  return (
    <div className={styles.container}>
      <h1>Edit Page</h1>
      <ToolBar
        currentId={currentId}
        createTextbox={createTextbox}
        textboxes={textboxes}
      />

      <DndContext>
        <div className={styles.editSpace}>
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
  )
}

export default SlideEditor
