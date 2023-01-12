import { Element, FiltersFunc, Lab, Pos, Scene } from './types'
import Grid from './elements/Grid'
import Builder from './Builder'
import Filters, { createAffineFilter, createFilter, createProjectiveFilter, createRotationFilter } from './Filters'
import Arrows from './elements/Arrows'

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

  public getDimensions (): Pos {
    return this._dimensions
  }

  public getScale (): number {
    return this.config.scale
  }

  private applyFilters: (x: number, y: number, isGrid: boolean) => Pos = (x: number, y: number, isGrid: boolean) => [0, 0]

  private readonly filters: FiltersFunc[] = []

  private config: Scene = {
    scale: 7,
    shiftX: 30,
    shiftY: 30,
    elements: []
  }

  constructor () {
    this.filters.push(createFilter((x: number, y: number) => Filters.scale(x, y, this.config.scale)))
    this.filters.push(createFilter((x: number, y: number) => Filters.shift(x, y, this.config.shiftX * this.config.scale, this.config.shiftY * this.config.scale), true))

    this.calculateApplyFilters()
  }

  public clearScene (): void {
    this._canvasCtx?.clearRect(0, 0, this._dimensions[0], this._dimensions[1])
    this.config.elements = []
  }

  public updateScene (scene: Partial<Scene>): void {
    const elements = [...this.config.elements.filter((element) => !(scene.elements ?? []).map(({ id }) => id).includes(element.id)), ...(scene.elements ?? [])]
    this.config = { ...this.config, ...scene, elements }
    this.calculateApplyFilters()
    this.draw()
  }

  private calculateApplyFilters (): void {
    const reverseFilterInx = this.filters.findIndex((filter) => filter.id === Filters.REVERSE)
    if (reverseFilterInx !== -1) {
      this.filters.splice(reverseFilterInx, 1)
    }
    this.filters.push(createFilter((x: number, y: number) => Filters.reverse(x, y, this._dimensions[0], this._dimensions[1]), false, Filters.REVERSE))
    this.applyFilters = (x: number, y: number, isGrid: boolean = false): Pos => this.filters.reduce<Pos>((res, filter) => {
      return isGrid && ((filter?.disableForGrid) === true) ? res : filter.exec(...res)
    }, [x, y])
  }

  public draw (): void {
    console.log('Draw called!', this.filters)

    this._canvasCtx?.clearRect(0, 0, this._dimensions[0], this._dimensions[1])

    const applyFilters = this.applyFilters

    if (this._canvasCtx != null) {
      const baseProps = {
        id: 'grid',
        ctx: this._canvasCtx,
        dimensions: this._dimensions,
        filters: applyFilters
      }

      const builder = new Builder(this.config, baseProps);

      (new Grid({ ...baseProps, scale: this.config.scale, filters: (x, y) => baseProps.filters(x, y, true) })).draw()

      const arrowsIndex = this.config.elements.findIndex((element) => Builder.isArrows(element))
      if (arrowsIndex !== -1) {
        const arrowsConfig = { ...this.config.elements[arrowsIndex] }
        if (Builder.isArrows(arrowsConfig) && arrowsConfig.lab === Lab.V1) {
          (new Arrows({ ...baseProps, ...arrowsConfig, filters: (x, y) => baseProps.filters(x, y, true) })).draw({})
          this.config.elements[arrowsIndex].shadow = true
        }
      }

      this.config.elements.filter((elem) => !(elem.shadow === true)).forEach((element) => {
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

  public removeFilterById (filter: string): void {
    const filterInx = this.filters.findIndex((fil) => fil.id === filter)
    if (filterInx === -1) {
      return
    }
    this.filters.splice(filterInx, 1)
    this.draw()
  }

  public addRotationFilter (angle: number, shiftX: number, shiftY: number): void {
    const filterInx = this.filters.findIndex((value) => value.id === Filters.ROTATION)
    const filter = createRotationFilter(
      shiftX * this.config.scale + this.config.shiftX * this.config.scale,
      shiftY * this.config.scale + this.config.shiftY * this.config.scale,
      angle / 1000 * Math.PI
    )

    if (filterInx !== -1) {
      this.filters[filterInx] = filter
    } else {
      this.filters.push(filter)
    }

    this.calculateApplyFilters()
    this.draw()
  }

  public addAffineFilter (xx: number, xy: number, yx: number, yy: number, ox: number, oy: number): void {
    const filterInx = this.filters.findIndex((value) => value.id === Filters.AFFINE)

    const filter = createAffineFilter(
      xx,
      xy,
      yx,
      yy,
      ox * this.config.scale,
      oy * this.config.scale
    )

    if (filterInx !== -1) {
      this.filters[filterInx] = filter
    } else {
      this.filters.push(filter)
    }

    this.calculateApplyFilters()
    this.draw()
  }

  public addProjectiveFilter (xx: number, xy: number, wx: number, yx: number, yy: number, wy: number, ox: number, oy: number, wo: number): void {
    const filterInx = this.filters.findIndex((value) => value.id === Filters.PROJECTIVE)

    const filter = createProjectiveFilter(
      xx * this.config.scale,
      xy * this.config.scale,
      wx,
      yx * this.config.scale,
      yy * this.config.scale,
      wy,
      ox * this.config.scale,
      oy * this.config.scale,
      wo
    )

    if (filterInx !== -1) {
      this.filters[filterInx] = filter
    } else {
      this.filters.push(filter)
    }

    this.calculateApplyFilters()
    this.draw()
  }
}
