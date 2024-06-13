import { atom } from 'recoil'
import type { ImageBox } from '../types/Slide'
import { type Slide, type TextBox } from '../types/Slide'

export const slidesState = atom<Slide[]>({
  key: 'slidesState',
  default: [],
})

export const textToolState = atom({
  key: 'textToolState',
  default: false,
})

export const textBoxesState = atom<TextBox[]>({
  key: 'textBoxesState',
  default: [],
})

export const ImagesState = atom<ImageBox[]>({
  key: 'ImagesState',
  default: [],
})

export const countTextBoxState = atom({
  key: 'countTextBoxState',
  default: 0,
})
