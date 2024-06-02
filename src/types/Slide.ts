import type { Editor } from '@tiptap/react'

export type TextBoxInSlide = {
  editor: Editor
  textBoxId: number
  x?: number
  y?: number
  width?: number
  height?: number
}

export type Slide = {
  slideId: string
  title: string
  content?: string
  textBoxInSlide?: TextBoxInSlide[]
}
