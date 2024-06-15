import type { Editor } from '@tiptap/react'

type SlideContentBase = {
  x: number
  isSelected: boolean
  y: number
  width: number
  height: number
}

export type TextBox = SlideContentBase & {
  editor: Editor
  textBoxId: number
}

export type SlideImage = SlideContentBase & {
  imageId: string
  src: string
}

export type Slide = {
  slideId: string
  title: string
  content?: string
  textBoxInSlide?: TextBox[]
}
