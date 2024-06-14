import { atom } from 'jotai'
import type { Slide, TextBox } from '../types/Slide'

export const slidesState = atom<Slide[]>([])

export const textBoxesState = atom<TextBox[]>([])

export const imagesState = atom<string[]>([])
