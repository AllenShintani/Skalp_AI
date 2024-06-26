import { atom } from 'jotai'
import type { Slide } from '../types/Slide'

export const slidesState = atom<Slide[]>([
  {
    title: 'New Slide',
    slideId: '0',
    images: [],
    textboxes: [],
    backgroundColor: '#ffffff',
  },
])

export const currentSlideIdState = atom<number>(0)
