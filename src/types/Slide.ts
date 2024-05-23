export type SlideElement = {
  id: string
  type: 'text' | 'shape'
  content: string
  x: number
  y: number
  width: number
  height: number
}

export type Slide = {
  id: string
  title: string
  content?: string
  elements?: SlideElement[]
}
