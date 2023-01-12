export enum Lab {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}

export enum Tabs {
  Build = 'build',
  Manipulate = 'manipulate',
}

export interface Scene {
  scale: number
  shiftX: number
  shiftY: number
  elements: Element[]
}

export enum ElementType {
  LINE = 'line',
  CIRCLE = 'circle',
  NicomedesCarhoid = 'nicomedes_carhoid',
  ARROWS = 'arrrows',
  GRID = 'grid',
}

export enum ElementRules {
  BindStartToStart = 'BindStartToStart',
  BindEndToEnd = 'BindEndToEnd',
  BindStartToEnd = 'BindStartToEnd',
  BindEndToStart = 'BindEndToStart',
}

export interface Binding {
  rule: ElementRules
  element: string
}

export type Matrix = [[number, number, number], [number, number, number], [number, number, number]]

export interface Element {
  id: string
  type: ElementType
  bindRules?: Binding[]
  shadow?: boolean
}

export interface ArrowsElement extends Element {
  id: 'arrows'
  type: ElementType.ARROWS
  lab: Lab
}

export interface LineElement extends Element {
  type: ElementType.LINE
  start: Pos
  end: Pos
}

export interface CircleElement extends Element {
  type: ElementType.CIRCLE
  startAngle: number
  endAngle: number
  r: number
  centerX: number
  centerY: number
  fill?: string
  reverse: boolean
}

export interface NicomedesCarhoidElement extends Element {
  type: ElementType.NicomedesCarhoid
  a: number
  b: number
  enableTagnet?: boolean
  enableNormal?: boolean
  enableAsymptotes?: boolean
  enablePDots?: boolean
  testPos: number
  highlight?: {
    from: number
    to: number
  }
}

export interface Drawable {
  id: string
  draw: (props?: any) => void
  getStartAndEndPos: () => [Pos, Pos]
}

export type Pos = [number, number]

export type FiltersFuncExec = (x: number, y: number) => Pos

export interface FiltersFunc { id?: string, exec: FiltersFuncExec, disableForGrid?: boolean }
