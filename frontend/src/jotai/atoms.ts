import { atom } from 'jotai'
import type { Slide } from '../types/Slide'

export const slidesState = atom<Slide[]>([])

export const currentSlideIdState = atom<number>(0)
