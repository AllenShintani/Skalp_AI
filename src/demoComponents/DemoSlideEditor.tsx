import type React from 'react'
import { useRouter } from 'next/router'
import StarterKit from '@tiptap/starter-kit'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import DemoToolBar from './DemoToolBar'
import { useRecoilState } from 'recoil'
import { countTextBoxState, textBoxesState } from '@/recoil/atoms'
type TextBox = {
  editor: Editor | null
  textBoxId: number
}
const DemoSlideEditor = () => {
  const router = useRouter()
  const [textboxes, setTextboxes] = useRecoilState(textBoxesState)
  // const [countTextbox, setCountTextbox] = useState(0)
  const [currentId, setCurrentId] = useState(0)

  return (
    <div>
      <h1>Demo Page</h1>
      <DemoToolBar currentId={currentId} />
      {textboxes?.map((textbox) => (
        <EditorContent
          key={textbox.textBoxId}
          editor={textbox.editor}
          onClick={() => setCurrentId(textbox.textBoxId)}
        />
      ))}
    </div>
  )
}

export default DemoSlideEditor
