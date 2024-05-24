import type React from 'react'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { DndContext } from '@dnd-kit/core'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import { slidesState } from '../../recoil/atoms'
import { FontSize } from '../extensions/FontsSize'
import Toolbar from './Toolbar'
import DraggableTextBox from './DraggableTextBox'
import styles from '../../styles/SlideEditor.module.css'

const SlideEditor: React.FC<{ id: string }> = ({ id }) => {
  const [slides, setSlides] = useRecoilState(slidesState)
  const [currentTextBoxId, setCurrentTextBoxId] = useState<string | null>(null)

  const slide = slides.find((slide) => slide.id === id)
  const editor = useEditor({
    extensions: [
      Text,
      Document,
      Paragraph,
      StarterKit,
      TextStyle,
      Underline,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
    ],
    content: '',
  })

  useEffect(() => {
    if (currentTextBoxId && editor) {
      const selectedElement = slide?.elements?.find(
        (el) => el.id === currentTextBoxId,
      )
      if (selectedElement) {
        editor.commands.setContent(selectedElement.content)
      }
    }
  }, [currentTextBoxId, editor, slide])

  const handleElementChange = (
    elementId: string,
    content: string,
    width?: number,
    height?: number,
    x?: number,
    y?: number,
  ) => {
    const updatedSlides = slides.map((slide) =>
      slide.id === id
        ? {
            ...slide,
            elements: slide.elements?.map((el) =>
              el.id === elementId
                ? {
                    ...el,
                    content,
                    width: width || el.width,
                    height: height || el.height,
                    x: x ?? el.x,
                    y: y ?? el.y,
                  }
                : el,
            ),
          }
        : slide,
    )
    setSlides(updatedSlides)
  }

  const handleTextBoxClick = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation() // イベントのバブリングを防ぐ
    const selectedElement = slide?.elements?.find((el) => el.id === elementId)
    if (!editor || !selectedElement) return
    setCurrentTextBoxId(elementId)
  }

  const handleSlideClick = () => {
    if (currentTextBoxId && editor) {
      const selectedElement = slide?.elements?.find(
        (el) => el.id === currentTextBoxId,
      )
      if (selectedElement) {
        handleElementChange(
          selectedElement.id,
          editor.getText(), // 現在のエディタの内容をプレーンテキストとして取得
          selectedElement.width,
          selectedElement.height,
          selectedElement.x,
          selectedElement.y,
        )
      }
    }
    setCurrentTextBoxId(null)
  }

  if (!slide) return <div>Loading...</div>

  return (
    <div
      className={styles.editorContainer}
      onClick={handleSlideClick}
    >
      {editor && (
        <div
          className={styles.toolbarContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <Toolbar editor={editor} />
        </div>
      )}
      <DndContext
        onDragEnd={({ delta }) => {
          const activeElement = slides
            .flatMap((slide) => slide.elements || [])
            .find((e) => e.id === currentTextBoxId)
          if (activeElement) {
            handleElementChange(
              activeElement.id,
              activeElement.content,
              activeElement.width,
              activeElement.height,
              activeElement.x + delta.x,
              activeElement.y + delta.y,
            )
          }
        }}
      >
        <div className={styles.slideContainer}>
          <div className={styles.slide}>
            {slide.elements?.map((element) => (
              <DraggableTextBox
                key={element.id}
                element={element}
                onClick={(event) => handleTextBoxClick(element.id, event)}
                onUpdate={(x, y) =>
                  handleElementChange(
                    element.id,
                    element.content,
                    element.width,
                    element.height,
                    x,
                    y,
                  )
                }
                editor={editor}
                isActive={currentTextBoxId === element.id}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  )
}

export default SlideEditor
