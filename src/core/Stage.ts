import { Element, FiltersFunc, Pos, Scene } from './types'
import Grid from './elements/Grid'
import Builder from './Builder'
import Filters, { createFilter } from './Filters'

export default class Stage {
  // eslint-disable-next-line accessor-pairs
  set dimensions (value: [number, number]) {
    this._dimensions = value
  }

  // eslint-disable-next-line accessor-pairs
  set canvasCtx (value: CanvasRenderingContext2D) {
    this._canvasCtx = value
  }

  private _canvasCtx: CanvasRenderingContext2D | null = null

  private _dimensions: [number, number] = [1280, 720]

  private readonly filters: FiltersFunc[] = []

  private config: Scene = {
    scale: 7,
    shiftX: 30,
    shiftY: 30,
    elements: []
  }

  constructor () {
    this.filters.push(createFilter((x: number, y: number) => Filters.reverse(x, y, this._dimensions[0], this._dimensions[1])))
    this.filters.push(createFilter((x: number, y: number) => Filters.scale(x, y, this.config.scale)))
    this.filters.push(createFilter((x: number, y: number) => Filters.shift(x, y, this.config.shiftX, this.config.shiftY), true))
  }

  public updateScene (scene: Scene): void {
    this.config = { ...this.config, ...scene }
    this.draw()
  }

  public draw (): void {
    console.log('Draw called!')

    this._canvasCtx?.clearRect(0, 0, this._dimensions[0], this._dimensions[1])

    const applyFilters = (x: number, y: number, isGrid: boolean = false): Pos =>
      this.filters.reduceRight<Pos>((res, filter) => isGrid && ((filter?.disableForGrid) === true) ? res : filter.exec(...res), [x, y])

    if (this._canvasCtx != null) {
      const baseProps = {
        id: 'grid',
        ctx: this._canvasCtx,
        dimensions: this._dimensions,
        filters: applyFilters
      }

      const builder = new Builder(this.config, baseProps);

      (new Grid({ ...baseProps, scale: this.config.scale, filters: (x, y) => baseProps.filters(x, y, true) })).draw()

      this.config.elements.forEach((element) => {
        builder.build(element)?.draw()
      })
    }
  }

  public addElement (element: Element, shallow: boolean = false): void {
    this.config.elements.push(element)
    if (!shallow) {
      this.draw()
    }
  }

  public removeElement (elementId: string, shallow: boolean = false): void {
    const elementInx = this.config.elements.findIndex((drawable, inx) => drawable.id === elementId)
    if (elementInx === -1) {
      return
    }
    this.config.elements.splice(elementInx, 1)
    if (!shallow) {
      this.draw()
    }
  }

  public updateElement (element: Element): void {
    this.removeElement(element.id, true)
    this.addElement(element, true)
    this.draw()
  }

  public applyFilter (filter: FiltersFunc): void {
    this.filters.push(filter)
    this.draw()
  }

  public removeFilter (filter: FiltersFunc): void {
    const filterInx = this.filters.indexOf(filter)
    if (filterInx === -1) {
      return
    }
    this.filters.splice(filterInx, 1)
    this.draw()
  }

  public updateFilterById (filter: FiltersFunc): void {
    console.log('updateFilterById')
    const filterInx = this.filters.findIndex((value) => value.id === filter.id)
    if (filterInx !== -1) {
      this.filters.splice(filterInx, 1)
    }

    this.filters.push(filter)
    this.draw()
  }
}
