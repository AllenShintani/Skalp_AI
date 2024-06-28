import type { Editor } from '@tiptap/react'

type SlideContentBase = {
  id: string
  x: number
  isSelected: boolean
  y: number
  width: number
  height: number
}

export type TextBox = SlideContentBase & {
  editor: Editor
}

export type SlideImage = SlideContentBase & {
  src: string
}

export type Slide = {
  slideId: string
  title: string
  textboxes: TextBox[]
  images: SlideImage[]
  backgroundColor: string
}
