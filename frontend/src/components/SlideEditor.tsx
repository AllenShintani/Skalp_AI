import { useCallback, useEffect, useRef, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import ToolBar from './ToolBar'
import styles from './SlideEditor.module.css'
import DraggableTextBox from './DraggableTextBox'
import { Underline } from '@tiptap/extension-underline'
import { Strike } from '@tiptap/extension-strike'
import { BulletList } from '@tiptap/extension-bullet-list'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { FontSize } from '@/components/extensions/FontSize'
import Sidebar from './Sidebar'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import DraggableSlideImage from './DraggableSlideImage'
import { useAtom } from 'jotai'
import { currentSlideIdState, slidesState } from '@/jotai/atoms'
import { useRouter } from 'next/router'
import type { ColorResult } from 'react-color'

const SlideEditor = () => {
  const [slides, setSlides] = useAtom(slidesState)
  const [currentSlide, setCurrentSlide] = useAtom(currentSlideIdState)
  const [scale, setScale] = useState(1)
  const [selectedRange, setSelectedRange] = useState<{
    from: number
    to: number
  } | null>(null)

  const router = useRouter()
  const { id } = router.query

  const editorRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id && typeof id === 'string') {
      const slideIndex = parseInt(id, 10)
      if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < slides.length) {
        setCurrentSlide(slideIndex)
      }
    }
  }, [id, setCurrentSlide, slides.length])

  const createTextbox = () => {
    const editor = new Editor({
      content: `<p>Example Text</p>`,
      extensions: [
        StarterKit.configure({}),
        Underline,
        Strike,
        FontFamily.configure({ types: ['textStyle'] }),
        FontSize,
        Heading,
        BulletList,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
      ],
    })
    setSlides((prev) => {
      prev[currentSlide].textboxes.push({
        editor,
        id: crypto.randomUUID(),
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        isSelected: false,
      })
      return [...prev]
    })
  }

  const createNewSlide = () => {
    const newSlide = {
      title: 'New Slide',
      slideId: slides.length.toString(),
      textboxes: [],
      images: [],
      backgroundColor: '#ffffff',
    }
    setSlides([...slides, newSlide])
  }

  const selectContent = (id: string | null) => {
    setSlides((prev) =>
      prev.map((slide) => {
        const allContents = [...slide.images, ...slide.textboxes]
        allContents.map((content) => {
          content.isSelected = content.id === id
          return content
        })
        return slide
      }),
    )
  }

  const getSelectedContentId = () => {
    const selectedSlide = slides[currentSlide]
    const SlideContent = [...selectedSlide.textboxes, ...selectedSlide.images]
    const selectedContent = SlideContent.find((content) => content.isSelected)
    return selectedContent ? selectedContent.id : null
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
    setScale(newScale)
    slideElement.style.transform = `scale(${newScale})`
  }, [])

  const processImageFile = useCallback(
    async (file: File, x: number, y: number) => {
      const getImageSize = (
        src: string,
      ): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            resolve({ width: img.width, height: img.height })
          }
          img.src = src
        })
      }
      const reader = new FileReader()
      //TODO: バックエンドの保存を実装する？
      reader.onload = async (loadEvent) => {
        const src = loadEvent.target?.result
        if (typeof src === 'string') {
          const { width, height } = await getImageSize(src)
          setSlides((prev) => {
            prev[currentSlide].images.push({
              id: `image-${prev[currentSlide].images.length}`,
              src,
              x,
              y,
              width,
              height,
              isSelected: false,
            })
            return [...prev]
          })
        }
      }
      reader.readAsDataURL(file)
    },
    [currentSlide, setSlides],
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const editorElement = editorRef.current
      if (!editorElement) return
      const items = event.clipboardData?.items
      if (!items) return

      Array.from(items).map((item) => {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            processImageFile(file, 0, 0)
          }
        }
      })
    },
    [processImageFile],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const slideElement = slideRef.current
      if (!slideElement) return

      //スライド要素内の座標に変換
      const rect = slideElement.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const files = Array.from(event.dataTransfer.files)
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          processImageFile(file, x, y)
        }
      })
    },
    [processImageFile],
  )

  const changeBackgroundColor = (color: ColorResult) => {
    const newColor = color.hex
    setSlides((prevSlides) => {
      return prevSlides.map((slide, index) => {
        if (index === currentSlide) {
          return { ...slide, backgroundColor: newColor }
        }
        return slide
      })
    })
  }

  const setTextColor = useCallback(
    (color: string) => {
      const selectedTextBox = slides[currentSlide].textboxes.find(
        (textbox) => textbox.isSelected,
      )
      if (selectedTextBox && selectedTextBox.editor && selectedRange) {
        selectedTextBox.editor
          .chain()
          .focus()
          .setTextSelection(selectedRange)
          .setColor(color)
          .run()
      }
    },
    [currentSlide, slides, selectedRange],
  )

  const saveSelection = useCallback(() => {
    const selectedTextBox = slides[currentSlide].textboxes.find(
      (textbox) => textbox.isSelected,
    )
    if (selectedTextBox && selectedTextBox.editor) {
      const { from, to } = selectedTextBox.editor.state.selection
      setSelectedRange({ from, to })
    }
  }, [currentSlide, slides])

  useEffect(() => {
    handleResizeWindow()
    const editorElement = editorRef.current
    if (editorElement) {
      editorElement.addEventListener('paste', handlePaste)
    }
    window.addEventListener('resize', handleResizeWindow)
    return () => {
      if (editorElement) {
        editorElement.removeEventListener('paste', handlePaste)
      }
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [handleResizeWindow, handlePaste])

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div
          className={styles.sidebar}
          onClick={() => selectContent(null)}
        >
          <Sidebar />
        </div>
        <div className={styles.toolbar}>
          <h1>Edit</h1>
          <ToolBar
            currentId={getSelectedContentId()}
            createTextbox={createTextbox}
            createNewSlide={createNewSlide}
            changeBackgroundColor={changeBackgroundColor}
            setTextColor={setTextColor}
            saveSelection={saveSelection}
            content={[
              ...slides[currentSlide].textboxes,
              ...slides[currentSlide].images,
            ]}
            backgroundColor={slides[currentSlide].backgroundColor || '#ffffff'}
          />
        </div>

        <div
          className={styles.editor}
          ref={editorRef}
          onClick={() => selectContent(null)}
        >
          <DndContext>
            <div
              className={styles.slide}
              ref={slideRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                backgroundColor:
                  slides[currentSlide].backgroundColor || '#ffffff',
              }}
            >
              {slides[currentSlide].textboxes.map((textbox) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    selectContent(textbox.id)
                  }}
                  key={textbox.id}
                >
                  <DraggableTextBox
                    key={textbox.id}
                    textbox={textbox}
                    scale={scale}
                  />
                </div>
              ))}
              {slides[currentSlide].images.map((image) => (
                <div
                  onClick={() => selectContent(image.id)}
                  key={image.id}
                >
                  <DraggableSlideImage
                    key={image.id}
                    image={image}
                    scale={scale}
                  />
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
