import { atom } from 'recoil'
import type { Slide } from '../types/Slide'

export const slidesState = atom<Slide[]>({
  key: 'slidesState',
  default: [],
})

export const textToolState = atom({
  key: 'textToolState',
  default: false,
})
