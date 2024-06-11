import type { Editor } from '@tiptap/react'

export type TextBox = {
  editor: Editor
  textBoxId: number
  x: number
  y: number
  isSelected: boolean
  width: number
  height: number
}

export type Slide = {
  slideId: string
  title: string
  imageURL?: string
  content?: string
  textBoxInSlide?: TextBox[]
}
