import type React from 'react'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { slidesState, textToolState } from '../../recoil/atoms'
import type { SlideElement } from '../../types/Slide'
import styles from '../../styles/SlideEditor.module.css'
import Toolbar from './Toolbar'
import DraggableElement from './DraggableElement'
import { DndContext } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import TextBox from './TextBox'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import { FontSize } from '../extensions/Fontsize'

const SlideEditor: React.FC<{ id: string }> = ({ id }) => {
  const [slides, setSlides] = useRecoilState(slidesState)
  const slide = slides.find((slide) => slide.id === id)
  const [currentTextBoxId, setCurrentTextBoxId] = useState<string | null>(null)
  const isTextToolActive = useRecoilValue(textToolState)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [drawnElement, setDrawnElement] = useState<SlideElement | null>(null)
  const router = useRouter()

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
    ],
    content: '<p>ここに初期テキストが追加されます</p>',
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTextToolActive) return
    setIsDrawing(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
    const newTextBox: SlideElement = {
      id: uuidv4(),
      type: 'text',
      content: '',
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top,
      width: 100,
      height: 100,
    }
    setDrawnElement(newTextBox)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const currentX = e.clientX - e.currentTarget.getBoundingClientRect().left
    const currentY = e.clientY - e.currentTarget.getBoundingClientRect().top
    const newWidth = currentX - startX
    const newHeight = currentY - startY
    if (drawnElement) {
      setDrawnElement({
        ...drawnElement,
        width: newWidth,
        height: newHeight,
      })
    }
  }

  const handleMouseUp = () => {
    if (drawnElement) {
      const updatedSlides = slides.map((s) =>
        s.id === id
          ? { ...s, elements: [...(s.elements || []), drawnElement] }
          : s,
      )
      setSlides(updatedSlides)
      setCurrentTextBoxId(drawnElement.id)
      setDrawnElement(null)
    }
    setIsDrawing(false)
  }

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

  if (!slide) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.editorContainer}>
      {editor && (
        <Toolbar
          editor={editor}
          onCreateNewSlide={createNewSlide}
        />
      )}
      <div className={styles.slideContainer}>
        <DndContext modifiers={[restrictToParentElement]}>
          <div
            className={`${styles.slide} ${
              isTextToolActive ? styles.drawingCursor : styles.defaultCursor
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {slide.elements?.map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                onElementChange={handleElementChange}
                onClick={() => handleTextBoxClick(element.id)}
              />
            ))}
            {drawnElement && (
              <div
                className={styles.textBox}
                style={{
                  left: drawnElement.x,
                  top: drawnElement.y,
                  width: drawnElement.width,
                  height: drawnElement.height,
                  position: 'absolute',
                  border: '1px solid #000',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                }}
              />
            )}
            {currentTextBoxId && editor && <TextBox editor={editor} />}
          </div>
        </DndContext>
      </div>
    </div>
  )
}

export default SlideEditor
