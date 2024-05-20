import { atom } from 'recoil'

export type Slide = {
  id: string
  title: string
  thumbnail: string
}

export const slidesState = atom<Slide[]>({
  key: 'slidesState',
  default: [],
})
