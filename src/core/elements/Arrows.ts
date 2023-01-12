import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, Lab, Pos } from '../types'

interface ArrowsProps extends BaseElementProps {
  lab: Lab
}

export default class Arrows extends BaseElement implements Drawable {
  private readonly lab: Lab

  constructor ({ lab, ctx, filters, dimensions, id }: ArrowsProps) {
    super({ ctx, filters, id, dimensions })

    this.lab = lab
  }

  public getStartAndEndPos: () => [Pos, Pos] = () => [[0, 0], [0, 0]]

  public draw (props: any): void {
    const k = this.lab === Lab.V2 ? 20 : 8
    const p = this.dimensions[1] / k - 1
    const q = 1
    this.ctx.beginPath()
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = '#000'
    this.ctx.moveTo(...this.filters(p, q))
    this.ctx.lineTo(...this.filters(this.dimensions[1] / k, 0))
    this.ctx.lineTo(...this.filters(p, -q))

    this.ctx.moveTo(...this.filters(q, p))
    this.ctx.lineTo(...this.filters(0, this.dimensions[1] / k))
    this.ctx.lineTo(...this.filters(-q, p))
    //
    this.ctx.moveTo(...this.filters(0, -this.dimensions[1] / k))
    this.ctx.lineTo(...this.filters(0, this.dimensions[1] / k))
    //
    this.ctx.moveTo(...this.filters(-this.dimensions[1] / k, 0))
    this.ctx.lineTo(...this.filters(this.dimensions[1] / k, 0))
    this.ctx.stroke()
  }
}
