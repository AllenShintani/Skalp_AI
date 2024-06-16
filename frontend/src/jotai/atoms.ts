import { atom } from 'jotai'
import type { Slide } from '../types/Slide'

export const slidesState = atom<Slide[]>([])
