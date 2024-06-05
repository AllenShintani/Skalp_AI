export type ResizeOptions = {
  width: number
  height: number
  x: number
  y: number
}

export type Direction =
  | 'north'
  | 'northEast'
  | 'east'
  | 'southEast'
  | 'south'
  | 'southWest'
  | 'west'
  | 'northWest'
  | 'default'

export type ResizeDivs = {
  direction: Direction
  className: string
}
