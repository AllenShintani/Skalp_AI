import type React from 'react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { DndContext } from '@dnd-kit/core'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { slidesState } from '../../recoil/atoms'
import DraggableTextBox from './DraggableTextBox'
import styles from '../../styles/SlideEditor.module.css'
import Toolbar from './Toolbar'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import Header from './Header'
import type { TextBoxReSizable } from '@/types/TextBoxReSizable'

const SlideEditor: React.FC<{ slideId: string }> = ({ slideId }) => {
  const [slides, setSlides] = useRecoilState(slidesState)
  const [textBoxes, setTextBoxes] = useState<TextBoxReSizable[]>([])
  const [countTextbox, setCountTextbox] = useState(0)
  const [currentTextBoxId, setCurrentTextBoxId] = useState<number>(0)

  const router = useRouter()

  const slide = slides.find((slide) => slide.slideId === slideId)

  console.log('slides', slides)
  console.log('slide', slide)
  console.log('slide id', slide?.slideId)
  console.log('id', slideId)

  const createTextbox = () => {
    setCountTextbox((prev) => prev + 1)
    if (!textBoxes) {
      const editor = new Editor({
        content: `<p>Example Text</p>`,
        extensions: [StarterKit],
      })
      setTextBoxes([
        {
          editor: editor,
          textBoxId: countTextbox,
          x: 10,
          y: 10,
          width: 150,
          height: 40,
        },
      ])
      return
    }

    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [StarterKit],
    })
    setTextBoxes([
      ...textBoxes,
      {
        editor: editor,
        textBoxId: countTextbox,
        x: 10,
        y: 10,
        width: 150,
        height: 40,
      },
    ])
  }

  const handleTextBox = (
    textBoxId: number,
    width?: number,
    height?: number,
    x?: number,
    y?: number,
  ) => {
    const updatedSlides = slides.map((slide) =>
      slide.slideId === slideId
        ? {
            ...slide,
            elements: slide.textBoxInSlide?.map((textBoxInSlide) =>
              textBoxInSlide.textBoxId === textBoxId
                ? {
                    ...textBoxInSlide,
                    width: width || textBoxInSlide.width,
                    height: height || textBoxInSlide.height,
                    x: x ?? textBoxInSlide.x,
                    y: y ?? textBoxInSlide.y,
                  }
                : textBoxInSlide,
            ),
          }
        : slide,
    )
    setSlides(updatedSlides)
  }

  const TextBoxClick = (textBoxId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const selectedElement = slide?.textBoxInSlide?.find(
      (textBoxInSlide) => textBoxInSlide.textBoxId === textBoxId,
    )
    if (!Editor || !selectedElement) return
    setCurrentTextBoxId(textBoxId)
  }

  const handleSlideClick = () => {
    if (!currentTextBoxId || !Editor) return

    const selectedElement = slide?.textBoxInSlide?.find(
      (textBoxInSlide) => textBoxInSlide.textBoxId === currentTextBoxId,
    )
    if (!selectedElement) return
    handleTextBox(
      selectedElement.textBoxId,
      selectedElement.width,
      selectedElement.height,
      selectedElement.x,
      selectedElement.y,
    )

    setCurrentTextBoxId(0)
  }

  const createNewSlide = () => {
    const newSlideId = uuidv4()
    const newSlide = {
      slideId: newSlideId,
      title: '',
      thumbnail: '/thumbnails/default.jpg',
      content: '',
      elements: [],
    }
    setSlides([...slides, newSlide])
    router.push(`/slide/${newSlideId}`)
  }

  if (!slide) return <div>Loading...</div>

  return (
    <>
      <Header
        onAddTextBox={createTextbox}
        onCreateNewSlide={createNewSlide}
      />
      <div
        className={styles.editorContainer}
        onClick={handleSlideClick}
      >
        <div
          className={styles.toolbarContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <Toolbar editor={textBoxes[currentTextBoxId].editor} />
        </div>

        <DndContext
          onDragEnd={({ delta }) => {
            const activeTextBox = slides
              .flatMap((slide) => slide.textBoxInSlide || [])
              .find((e) => e.textBoxId === currentTextBoxId)
            if (!activeTextBox) return
            handleTextBox(
              activeTextBox.textBoxId,
              activeTextBox.width,
              activeTextBox.height,
              activeTextBox.x + delta.x,
              activeTextBox.y + delta.y,
            )
          }}
        >
          <div className={styles.slideContainer}>
            <div className={styles.slide}>
              {slide.textBoxInSlide?.map((textBox) => (
                <DraggableTextBox
                  key={textBox.textBoxId}
                  textBox={textBox}
                  onClick={(event) => TextBoxClick(textBox.textBoxId, event)}
                  onUpdate={(x, y) =>
                    handleTextBox(
                      textBox.textBoxId,
                      textBox.width,
                      textBox.height,
                      x,
                      y,
                    )
                  }
                  isActive={currentTextBoxId === textBox.textBoxId}
                />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </>
  )
}

export default SlideEditor
