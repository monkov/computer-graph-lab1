import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, Pos } from '../types'

export interface LineProps extends BaseElementProps {
  start: Pos
  end: Pos
}

export default class Line extends BaseElement implements Drawable {
  public start: Pos

  public end: Pos

  constructor ({ start, end, dimensions, ctx, filters, id }: LineProps) {
    super({ ctx, filters, dimensions, id })

    this.start = start
    this.end = end
  }

  public draw (): void {
    const [x1, y1] = this.start
    const [x2, y2] = this.end

    // @ts-expect-error
    window.fl = this.filters
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'
    this.ctx.moveTo(...this.filters(x1, y1))
    this.ctx.lineTo(...this.filters(x2, y2))
    this.ctx.stroke()
  }

  public getStartAndEndPos (): [Pos, Pos] {
    return [this.start, this.end]
  }
}
