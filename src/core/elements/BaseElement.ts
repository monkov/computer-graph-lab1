import { FiltersFuncExec, Pos } from '../types'

export interface BaseElementProps {
  ctx: CanvasRenderingContext2D
  filters: FiltersFuncExec
  dimensions: Pos
  id: string
}

export abstract class BaseElement {
  protected filters: FiltersFuncExec
  protected dimensions: Pos
  protected ctx: CanvasRenderingContext2D
  public id: string

  constructor ({ ctx, dimensions, filters, id }: BaseElementProps) {
    this.filters = filters
    this.id = id
    this.dimensions = dimensions
    this.ctx = ctx
  }
}
