import type React from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
} from '@fortawesome/free-solid-svg-icons'
import type { TextBox } from '@/types/Slide'

type Props = {
  currentId: number | null
  createTextbox: () => void
  createNewSlide: () => void
  textboxes: TextBox[]
}

const ToolBar: React.FC<Props> = ({ currentId, createTextbox, textboxes, createNewSlide }) => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      <button onClick={createTextbox}>Create textbox</button>
      <button onClick={createNewSlide}>Create Slide Page</button>
      <button
        onClick={() =>
          currentId !== null &&
          textboxes[currentId]?.editor?.chain().focus().toggleBold().run()
        }
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        onClick={() =>
          currentId !== null &&
          textboxes[currentId]?.editor?.chain().focus().toggleItalic().run()
        }
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        onClick={() =>
          currentId !== null &&
          textboxes[currentId]?.editor?.chain().focus().toggleUnderline().run()
        }
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <select
        onChange={(e) =>
          currentId !== null &&
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setFontFamily(e.target.value)
            .run()
        }
        value={
          currentId !== null
            ? textboxes[currentId]?.editor?.getAttributes('textStyle')
                .fontFamily
            : ''
        }
      >
        <option value="Arial">Arial</option>
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="Georgia">Georgia</option>
      </select>
      <select
        onChange={(e) =>
          currentId !== null &&
          textboxes[currentId]?.editor
            ?.chain()
            .focus()
            .setFontSize(e.target.value)
            .run()
        }
        value={
          currentId !== null
            ? textboxes[currentId]?.editor?.getAttributes('fontSize').size
            : ''
        }
      >
        <option value="12">12px</option>
        <option value="16">16px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="32">32px</option>
      </select>
      <button
        onClick={() =>
          currentId !== null &&
          textboxes[currentId]?.editor?.chain().focus().toggleStrike().run()
        }
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button
        onClick={() =>
          currentId !== null &&
          textboxes[currentId]?.editor?.chain().focus().toggleBulletList().run()
        }
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        onClick={() =>
          currentId !== null &&
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
          currentId !== null &&
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
          currentId !== null &&
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
