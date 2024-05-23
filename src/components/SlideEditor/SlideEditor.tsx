import type React from 'react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { slidesState } from '../../recoil/atoms'
import type { SlideElement } from '../../types/Slide'
import styles from '../../styles/SlideEditor.module.css'
import Toolbar from './Toolbar'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import TextBox from './TextBox'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import { FontSize } from '../extensions/FontsSize'

const SlideEditor: React.FC<{ id: string }> = ({ id }) => {
  const [slides, setSlides] = useRecoilState(slidesState)
  const slide = slides.find((slide) => slide.id === id)
  const [currentTextBoxId, setCurrentTextBoxId] = useState<string | null>(null)
  const router = useRouter()

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
    ],
    content: '',
  })

  const handleElementChange = (
    elementId: string,
    content: string,
    width?: number,
    height?: number,
  ) => {
    const updatedSlides = slides.map((s) =>
      s.id === id
        ? {
            ...s,
            elements: s.elements?.map((el) =>
              el.id === elementId
                ? {
                    ...el,
                    content: content,
                    width: width || el.width,
                    height: height || el.height,
                  }
                : el,
            ),
          }
        : s,
    )
    setSlides(updatedSlides)
  }

  const handleTextBoxClick = (elementId: string) => {
    setCurrentTextBoxId(elementId)
    const selectedElement = slide?.elements?.find((el) => el.id === elementId)
    if (editor && selectedElement) {
      editor.commands.setContent(selectedElement.content)
    }
  }

  const createNewSlide = () => {
    const newSlideId = uuidv4()
    const newSlide = {
      id: newSlideId,
      title: '',
      thumbnail: '/thumbnails/default.jpg',
      content: '',
      elements: [],
    }
    setSlides([...slides, newSlide])
    router.push(`/slide/${newSlideId}`)
  }

  const addTextBox = () => {
    const newTextBox: SlideElement = {
      id: uuidv4(),
      type: 'text',
      content: 'サンプルテキスト',
      x: 50,
      y: 50,
      width: 200,
      height: 100,
    }
    const updatedSlides = slides.map((s) =>
      s.id === id ? { ...s, elements: [...(s.elements || []), newTextBox] } : s,
    )
    setSlides(updatedSlides)
    setCurrentTextBoxId(newTextBox.id)
    if (editor) {
      editor.commands.setContent(newTextBox.content)
    }
  }

  if (!slide) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.editorContainer}>
      {editor && (
        <Toolbar
          editor={editor}
          onCreateNewSlide={createNewSlide}
          onAddTextBox={addTextBox}
        />
      )}
      <div className={styles.slideContainer}>
        <div className={styles.slide}>
          {slide.elements?.map((element) => (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                boxSizing: 'border-box',
              }}
              onClick={() => handleTextBoxClick(element.id)}
            >
              {currentTextBoxId === element.id && editor ? (
                <TextBox
                  editor={editor}
                  width={element.width}
                  height={element.height}
                />
              ) : (
                <div
                  style={{
                    border: '1px solid #000',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    padding: '8px',
                  }}
                >
                  {element.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideEditor
