import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import DemoToolBar from './DemoToolBar'
import styles from './DemoSlideEditor.module.css'
import DraggableTextBox from './DraggableTextBox'
import type { TextBox } from '@/types/Slide'

const DemoSlideEditor = () => {
  const [textboxes, setTextboxes] = useState<TextBox[]>([])
  const [countTextbox, setCountTextbox] = useState(0)
  const [currentId, setCurrentId] = useState(0)

  const createTextbox = () => {
    console.log('create textbox')
    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [StarterKit],
    })
    setTextboxes((prev) => [
      ...prev,
      {
        editor: editor,
        textBoxId: countTextbox,
        x: 100,
        y: 100,
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
      <h1>Demo Page</h1>
      <DemoToolBar
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

export default DemoSlideEditor
