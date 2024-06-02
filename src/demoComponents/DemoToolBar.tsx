import type React from 'react'
import { useRouter } from 'next/router'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { countTextBoxState, textBoxesState } from '@/recoil/atoms'
import TextBox from '@/components/SlideEditorPage/TextBox'

type TextBox = {
  editor: Editor | null
  textBoxId: number
}

type Props = {
  currentId: number
}

const DemoToolBar: React.FC<Props> = ({ currentId }) => {
  const [textboxes, setTextboxes] = useRecoilState(textBoxesState)
  const [countTextbox, setCountTextbox] = useState(0)
  const router = useRouter()

  const createTextbox = () => {
    setCountTextbox((prev) => prev + 1)
    if (!textboxes) {
      const editor = new Editor({
        content: `<p>Example Text</p>`,
        extensions: [StarterKit],
      })
      setTextboxes([{ editor: editor, textBoxId: countTextbox }])
      return
    }
    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [StarterKit],
    })
    setTextboxes([...textboxes, { editor: editor, textBoxId: countTextbox }])
  }
  // if (textboxes[currentId].editor) {
  //   textboxes[currentId].editor.getHTML()
  // }
  return (
    <div>
      <button onClick={() => router.push('/')}>Go to Home</button>
      <button onClick={createTextbox}>Create textbox</button>
      {
        <button
          onClick={() =>
            textboxes[currentId].editor.chain().focus().toggleBold().run()
          }
        >
          B
        </button>
      }
      {
        <button
          onClick={() =>
            textboxes[currentId].editor.chain().focus().toggleItalic().run()
          }
        >
          B2
        </button>
      }
    </div>
  )
}
export default DemoToolBar
