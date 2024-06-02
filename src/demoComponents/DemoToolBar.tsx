import type React from 'react'
import { useRouter } from 'next/router'
import StarterKit from '@tiptap/starter-kit'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { countTextBoxState, textBoxesState } from '@/recoil/atoms'
import type TextBox from '@/components/SlideEditorPage/TextBox'

type TextBox = {
  editor: Editor | null
  textBoxId: number
  x: number
  y: number
  isSelected: boolean
  width: number
  height: number
}

type Props = {
  currentId: number
  createTextbox: () => void
  textboxes: TextBox[]
}

const DemoToolBar: React.FC<Props> = ({
  currentId,
  createTextbox,
  textboxes,
}) => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push('/')}>Go to Home</button>
      <button onClick={createTextbox}>Create textbox</button>
      {
        <button
          onClick={() =>
            textboxes[currentId]?.editor?.chain().focus().toggleBold().run()
          }
        >
          B
        </button>
      }
      {
        <button
          onClick={() =>
            textboxes[currentId]?.editor?.chain().focus().toggleItalic().run()
          }
        >
          B2
        </button>
      }
    </div>
  )
}
export default DemoToolBar
