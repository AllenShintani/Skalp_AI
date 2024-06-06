import type React from 'react'
import { useRouter } from 'next/router'
import type { Editor } from '@tiptap/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
} from '@fortawesome/free-solid-svg-icons'

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

const ToolBar: React.FC<Props> = ({ currentId, createTextbox, textboxes }) => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      <button onClick={createTextbox}>Create textbox</button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor?.chain().focus().toggleBold().run()
        }
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor?.chain().focus().toggleItalic().run()
        }
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor?.chain().focus().toggleUnderline().run()
        }
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <select
        onChange={(e) =>
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setFontFamily(e.target.value)
            .run()
        }
        value={
          textboxes[currentId]?.editor?.getAttributes('textStyle').fontFamily
        }
      >
        <option value="Arial">Arial</option>
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="Georgia">Georgia</option>
      </select>
      <select
        onChange={(e) =>
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setFontSize(e.target.value)
            .run()
        }
        value={textboxes[currentId]?.editor?.getAttributes('fontSize').size}
      >
        <option value="12">12px</option>
        <option value="16">16px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="32">32px</option>
      </select>
      <button
        onClick={() =>
          textboxes[currentId]?.editor?.chain().focus().toggleStrike().run()
        }
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setTextAlign('left')
            .run()
        }
      >
        left
      </button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setTextAlign('center')
            .run()
        }
      >
        center
      </button>
      <button
        onClick={() =>
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setTextAlign('right')
            .run()
        }
      >
        right
      </button>
    </div>
  )
}

export default ToolBar
