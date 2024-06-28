import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
  faPalette,
  faFont,
} from '@fortawesome/free-solid-svg-icons'
import type { SlideImage, TextBox } from '@/types/Slide'
import type { ColorResult } from 'react-color'
import { ChromePicker } from 'react-color'

type Props = {
  currentId: string | null
  createTextbox: () => void
  createNewSlide: () => void
  changeBackgroundColor: (color: ColorResult) => void
  backgroundColor: string
  content: (TextBox | SlideImage)[]
  setTextColor: (color: string) => void
  saveSelection: () => void
}

const ToolBar: React.FC<Props> = ({
  currentId,
  createTextbox,
  createNewSlide,
  changeBackgroundColor,
  backgroundColor,
  content,
  saveSelection,
  setTextColor,
}) => {
  const router = useRouter()
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleTextColorChange = (color: ColorResult) => {
    setTextColor(color.hex)
  }

  const handleColorPickerToggle = () => {
    if (!showTextColorPicker) {
      saveSelection()
    }
    setShowTextColorPicker(!showTextColorPicker)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowTextColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedTextBox = content.find(
    (c): c is TextBox => c.id === currentId && 'editor' in c,
  )

  return (
    <div>
      <button onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      <button onClick={createNewSlide}>Create Slide Page</button>
      <button onClick={createTextbox}>Create textbox</button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().toggleBold().run()
        }
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().toggleItalic().run()
        }
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().toggleUnderline().run()
        }
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <button
        ref={buttonRef}
        onClick={handleColorPickerToggle}
      >
        <FontAwesomeIcon icon={faFont} />
      </button>
      {showTextColorPicker && (
        <div
          ref={colorPickerRef}
          style={{ position: 'absolute', zIndex: 1000 }}
        >
          <ChromePicker
            color="#FFFFFF"
            onChange={handleTextColorChange}
          />
          <button onClick={() => setShowTextColorPicker(false)}>Close</button>
        </div>
      )}

      <select
        onChange={(e) =>
          selectedTextBox &&
          selectedTextBox.editor
            .chain()
            .focus()
            .setFontFamily(e.target.value)
            .run()
        }
        value={
          selectedTextBox
            ? selectedTextBox.editor?.getAttributes('fontFamily').family
            : ''
        }
      >
        <option value="Arial">Arial</option>
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="Georgia">Georgia</option>
      </select>
      <select
        onChange={(e) =>
          selectedTextBox &&
          selectedTextBox.editor
            ?.chain()
            .focus()
            .setFontSize(e.target.value)
            .run()
        }
        value={
          selectedTextBox
            ? selectedTextBox.editor?.getAttributes('fontSize').size
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
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().toggleStrike().run()
        }
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().toggleBulletList().run()
        }
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().setTextAlign('left').run()
        }
      >
        left
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().setTextAlign('center').run()
        }
      >
        center
      </button>
      <button
        onClick={() =>
          selectedTextBox &&
          selectedTextBox.editor?.chain().focus().setTextAlign('right').run()
        }
      >
        right
      </button>
      <button onClick={() => setShowColorPicker(!showColorPicker)}>
        <FontAwesomeIcon icon={faPalette} />
      </button>
      {showColorPicker && (
        <div style={{ position: 'absolute', zIndex: 1000 }}>
          <ChromePicker
            color={backgroundColor}
            onChange={(color) => {
              changeBackgroundColor(color)
            }}
          />
          <button onClick={() => setShowColorPicker(false)}>Close</button>
        </div>
      )}
    </div>
  )
}

export default ToolBar
