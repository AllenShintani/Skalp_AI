import { useCallback, useEffect, useRef, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import ToolBar from './ToolBar'
import styles from './SlideEditor.module.css'
import DraggableTextBox from './DraggableTextBox'
import type { TextBox, ImageBox } from '@/types/Slide'
import { Text } from '@tiptap/extension-text'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Underline } from '@tiptap/extension-underline'
import { Strike } from '@tiptap/extension-strike'
import { BulletList } from '@tiptap/extension-bullet-list'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import { FontSize } from '@/components/extensions/FontSize'
import Sidebar from './Sidebar'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import DraggableImageBox from './DraggableImageBox'

const SlideEditor = () => {
  const [textboxes, setTextboxes] = useState<TextBox[]>([])
  const [Images, setImages] = useState<ImageBox[]>([])
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
        FontSize,
        Heading,
        BulletList,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
    })
    setTextboxes((prev) => [
      ...prev,
      {
        editor: editor,
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
    setTextboxes((prev) => {
      const newTextboxes = prev.map((textbox) =>
        textbox.textBoxId === id
          ? { ...textbox, isSelected: true }
          : { ...textbox, isSelected: false },
      )
      return newTextboxes
    })
  }
  const selectImage = (id: string) => {
    setImages((prev) => {
      const newImages = prev.map((image) =>
        image.imageId === id
          ? { ...image, isSelected: true }
          : { ...image, isSelected: false },
      )
      return newImages
    })
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

  const processImageFile = async (file: File, x: number, y: number) => {
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
        setImages((prev) => [
          ...prev,
          {
            imageId: `image-${prev.length}`,
            src,
            x,
            y,
            width,
            height,
            isSelected: false,
          },
        ])
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const editorElement = editorRef.current
    if (!editorElement) return
    const items = event.clipboardData?.items
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            processImageFile(file, 0, 0)
          }
        }
      }
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
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
  }, [])

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
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.toolbar}>
          <h1>Edit</h1>
          <ToolBar
            currentId={getSelectedTextBoxId()}
            createTextbox={createTextbox}
            textboxes={textboxes}
          />
        </div>

        <div
          className={styles.editor}
          ref={editorRef}
        >
          <DndContext>
            <div
              className={styles.slide}
              ref={slideRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {textboxes?.map((textbox) => (
                <div
                  onClick={() => selectTextBox(textbox.textBoxId)}
                  key={textbox.textBoxId}
                >
                  <DraggableTextBox textbox={textbox} />
                </div>
              ))}
              {Images?.map((image) => (
                <div
                  key={image.imageId}
                  onClick={() => selectImage(image.imageId)}
                >
                  <DraggableImageBox image={image} />
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
