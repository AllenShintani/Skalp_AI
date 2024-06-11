import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { toSvg } from 'html-to-image'
import ToolBar from './ToolBar'
import styles from './SlideEditor.module.css'
import DraggableTextBox from './DraggableTextBox'
import Sidebar from './Sidebar'
import { useAtom } from 'jotai'
import { slidesState, textBoxesState } from '../jotai/atoms'
import { TextStyle } from '@tiptap/extension-text-style'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Heading } from '@tiptap/extension-heading'

import { Underline } from '@tiptap/extension-underline'

import { FontFamily } from '@tiptap/extension-font-family'

import { TextAlign } from '@tiptap/extension-text-align'
import { Strike } from '@tiptap/extension-strike'
import { Text } from '@tiptap/extension-text'

import { Document } from '@tiptap/extension-document'

const SlideEditor = () => {
  const [slides, setSlides] = useAtom(slidesState)
  const [textboxes, setTextboxes] = useAtom(textBoxesState)
  const [countTextbox, setCountTextbox] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)

  const createTextbox = () => {
    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [
        StarterKit,
        Text,
        TextStyle,
        Document,
        Paragraph,
        Bold,
        Italic,
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
        Strike,
        FontFamily.configure({ types: ['textStyle'] }),
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
    })
    setTextboxes((prev) => [
      ...prev,
      {
        editor,
        textBoxId: countTextbox,
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        isSelected: false,
      },
    ])
    setCountTextbox((prev) => prev + 1)
  }

  const selectTextBox = (id: number) => {
    setTextboxes((prev) =>
      prev.map((textbox) =>
        textbox.textBoxId === id
          ? { ...textbox, isSelected: true }
          : { ...textbox, isSelected: false },
      ),
    )
  }

  const getSelectedTextBoxId = () => {
    const selectedTextBox = textboxes.find((textbox) => textbox.isSelected)
    return selectedTextBox ? selectedTextBox.textBoxId : null
  }

  const handleResizeWindow = useCallback(() => {
    const editorElement = editorRef.current
    const slideElement = slideRef.current
    if (!editorElement || !slideElement) return

    const editorWidth = editorElement.offsetWidth
    const editorHeight = editorElement.offsetHeight

    const targetWidth = 1000
    const targetHeight = 1000 * (9 / 16)

    const widthScale = (editorWidth - 30) / targetWidth
    const heightScale = editorHeight / targetHeight

    const newScale = Math.min(widthScale, heightScale)
    slideElement.style.transform = `scale(${newScale})`
  }, [])

  useEffect(() => {
    handleResizeWindow()

    window.addEventListener('resize', handleResizeWindow)
    return () => {
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [handleResizeWindow])

  const exportToSvg = async () => {
    if (!slideRef.current) return

    try {
      const svgDataUrl = await toSvg(slideRef.current)
      const link = document.createElement('a')
      link.href = svgDataUrl
      link.download = 'slide.svg'
      link.click()
    } catch (error) {
      console.error('Error exporting to SVG:', error)
    }
  }

  const createNewSlide = () => {
    const newSlide = {
      slideId: String(slides.length + 1),
      title: `Slide ${slides.length + 1}`,
      textBoxInSlide: [],
    }
    setSlides((prev) => [...prev, newSlide])
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.toolbar}>
          <h1>Edit</h1>
          <ToolBar
            currentId={getSelectedTextBoxId()}
            createTextbox={createTextbox}
            textboxes={textboxes}
            createNewSlide={createNewSlide}
          />
          <button onClick={exportToSvg}>Export to SVG</button>
        </div>
        <div
          className={styles.editor}
          ref={editorRef}
        >
          <DndContext>
            <div
              className={styles.slide}
              ref={slideRef}
            >
              {textboxes.map((textbox) => (
                <div
                  onClick={() => selectTextBox(textbox.textBoxId)}
                  key={textbox.textBoxId}
                >
                  <DraggableTextBox textbox={textbox} />
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default SlideEditor
