import { atom } from 'recoil'
import type { Slide, TextBoxInSlide } from '../types/Slide'

export const slidesState = atom<Slide[]>({
  key: 'slidesState',
  default: [],
})

export const textToolState = atom({
  key: 'textToolState',
  default: false,
})

export const textBoxesState = atom<TextBoxInSlide[]>({
  key: 'textBoxesState',
  default: [],
})

export const countTextBoxState = atom({
  key: 'countTextBoxState',
  default: 0,
})
