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
import type { SlideImage, TextBox } from '@/types/Slide'

type Props = {
  currentId: string | null
  createTextbox: () => void
  createNewSlide: () => void
  content: (TextBox | SlideImage)[]
}

const ToolBar: React.FC<Props> = ({
  currentId,
  createTextbox,
  createNewSlide,
  content,
}) => {
  const router = useRouter()

  const selectedContent = content.find((c) => c.id === currentId)

  const isTextBox = (content: TextBox | SlideImage): content is TextBox => {
    return 'editor' in content
  }

  return (
    <div>
      <button onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      <button onClick={createNewSlide}>Create Slide Page</button>
      <button onClick={createTextbox}>Create textbox</button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent?.editor?.chain().focus().toggleBold().run()
        }
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().toggleItalic().run()
        }
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().toggleUnderline().run()
        }
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <select
        onChange={(e) =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor
            .chain()
            .focus()
            .setFontFamily(e.target.value)
            .run()
        }
        value={
          selectedContent && isTextBox(selectedContent)
            ? selectedContent.editor?.getAttributes('fontFamily').family
            : ''
        }
      >
        <option value="Arial">Arial</option>
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="Georgia">Georgia</option>
      </select>
      <select
        onChange={(e) =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor
            ?.chain()
            .focus()
            .setFontSize(e.target.value)
            .run()
        }
        value={
          selectedContent && isTextBox(selectedContent)
            ? selectedContent.editor?.getAttributes('fontSize').fontSize
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
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().toggleStrike().run()
        }
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().toggleBulletList().run()
        }
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().setTextAlign('left').run()
        }
      >
        left
      </button>

      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().setTextAlign('center').run()
        }
      >
        center
      </button>
      <button
        onClick={() =>
          selectedContent &&
          isTextBox(selectedContent) &&
          selectedContent.editor?.chain().focus().setTextAlign('right').run()
        }
      >
        right
      </button>
    </div>
  )
}

export default ToolBar
